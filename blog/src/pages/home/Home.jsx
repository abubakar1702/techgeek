import MainHeadlines from "./MainHeadlines"
import FeaturedCategories from "./FeaturedCategories"
import JoinCommunity from "./JoinCommunity"
import RecentArticles from "./RecentArticles"
import ArtificialIntelligence from "./ArtificialIntelligence"
import Gaming from "./Gaming"
import Smartphone from "./Smartphone"
import Hardware from "./Hardware"

export const Home = () => {
  return (
    <div>
        <MainHeadlines />
        <RecentArticles />
        <ArtificialIntelligence />
        <Gaming />
        <Smartphone />
        <Hardware />
        <JoinCommunity />
    </div>
  )
}
