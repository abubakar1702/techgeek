import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import default_pfp from '../assets/Default_pfp.jpg';
import { getFullImageUrl } from '../utils/getFullImageUrl';

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/user/public/${id}/`);
                setUser(res.data);
            } catch (err) {
                setError('Failed to load user info');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 py-8">{error}</div>;
    }

    if (!user) return null;

    return (
        <div className="max-w-xl mx-auto my-10 p-6 bg-white border border-gray-200 rounded-xl shadow-md">
            <div className="flex flex-col items-center gap-4 mb-8">
                <img
                    src={getFullImageUrl(user.profile_picture) || default_pfp}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full border-4 border-blue-600"
                    onError={e => {
                        e.target.onerror = null;
                        e.target.src = default_pfp;
                    }}
                />

                <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.full_name || 'No Name Provided'}</h2>
                <p className="text-gray-600 mb-3">{user.email}</p>
            </div>
            {/* Published Blogs */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Published Blogs</h3>
                {user.published_blogs && user.published_blogs.length > 0 ? (
                    <ul className="space-y-4">
                        {user.published_blogs.map(blog => (
                            <li key={blog.id} className="p-2 border-b-1 hover:bg-gray-100 transition">
                                <a href={`/blog/${blog.slug}`} className="text-blue-600 font-semibold text-lg hover:underline">
                                    {blog.title}
                                </a>
                                <div className="text-xs text-gray-500 mb-2">
                                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No published blogs yet.</p>
                )}
            </div>
        </div>
    );
};

export default UserDetails;