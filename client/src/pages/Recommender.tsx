import {Feedback, Project, RecommendationPreferences} from "../types.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {AnimatePresence, motion} from "framer-motion"
import {Heart, HelpCircle, Loader2, Star, X} from "lucide-react";


export const Recommender = () => {

    const [loading, setLoading] = useState(false)
    const [serverURL, setServerURL] = useState("http://127.0.0.1:8000")
    const [userPreferences, setUserPreferences] = useState<RecommendationPreferences>()
    const [currentProjects, setCurrentProjects] = useState<Project[]>([])
    const [shownProject, setShownProject] = useState<Project>()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isInitialized, setIsInitialized] = useState(false)
    const [isCurrentStarred, setIsCurrentStarred] = useState(false);


    useEffect(() => {
        const tags = localStorage.getItem('tags') ?? "python"
        const min_stars = parseInt(localStorage.getItem('min_stars') ?? '0')
        const max_stars = parseInt(localStorage.getItem('max_stars') ?? '30000')
        setServerURL(localStorage.getItem('server_url') ?? "http://127.0.0.1:8000")

        setUserPreferences({
            tags: tags,
            min_stars: min_stars,
            max_stars: max_stars
        })
    }, [])

    useEffect(() => {
        if (isInitialized || !userPreferences) return
        handleLoading()
        fetchRecommendation()
        setIsInitialized(true)
    }, [userPreferences, serverURL])

    const fetchRecommendation = async () => {
        setLoading(true)
        try{
            const response = await axios.get(`${serverURL}/recommend/`, {
                params: {
                    tags: userPreferences?.tags,
                    min_stars: userPreferences?.min_stars,
                    max_stars: userPreferences?.max_stars
                }
            })
            setCurrentProjects(response.data)
            setShownProject(response.data[0])
            setCurrentIndex(0)
        }
        catch (e) {
            console.error(e)
        }
        finally {
            setLoading(false)
        }
    }

    const showNextProject = () => {
        if (currentIndex + 1 < currentProjects.length) {
            setCurrentIndex(currentIndex + 1)
            setShownProject(currentProjects[currentIndex + 1])
        }
        else {
            setLoading(true)
            handleSaving()
            fetchRecommendation()
            setLoading(false)
        }
        setIsCurrentStarred(false)
    }

    const handleFeedback = async (feedback:string) => {
        const feedback_request: Feedback = {
            project_url: shownProject?.url ?? "github.com",
            feedback: feedback
        }

        try {
            await axios.post(`${serverURL}/feedback/`, feedback_request, {
                params: {
                    tags: userPreferences?.tags,
                    min_stars: userPreferences?.min_stars,
                    max_stars: userPreferences?.max_stars
                }
            })

            showNextProject()

        }
        catch (e) {
            console.error("error: ", e)
        }
    }

    const handleSaving = async () => {
        try {
            axios.post(`${serverURL}/save-model/`)
        }
        catch (e) {
            console.error("error: ", e)
        }
    }

    const handleLoading = async () => {
        try {
            axios.post(`${serverURL}/load-model/`)
        }
        catch (e) {
            console.error("error: ", e)
        }
    }

    const handleStarring = () => {
        if (!shownProject?.url) return

        const starredProjects = JSON.parse(localStorage.getItem("starred_projects") || "[]")
        const isAlreadyStarred = starredProjects.some((project: Project) => project.url === shownProject.url)

        if (!isAlreadyStarred) {
            starredProjects.push(shownProject)

            localStorage.setItem("starred_projects", JSON.stringify(starredProjects))
        }
        setIsCurrentStarred(true)
    }

    return (
        <div
            className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-gray-800 to-purple-900 flex justify-center items-center p-4">
            <div
                className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <Loader2 className="w-12 h-12 text-white animate-spin"/>
                    </div>
                ) : shownProject ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={shownProject.url}
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -50}}
                            transition={{duration: 0.3}}
                            className="p-6"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">{shownProject.name}</h2>
                            <p className="text-gray-300 mb-4">{shownProject.description}</p>
                            <div className="flex items-center mb-4">
                                <svg className="w-5 h-5 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                <span className="text-white font-semibold">{shownProject.stars}</span>
                            </div>
                            <p className="text-gray-300 mb-2">Language: {shownProject.language}</p>
                            <p className="text-gray-300 mb-4">Last
                                updated: {new Date(shownProject.last_updated).toLocaleDateString()}</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {shownProject.topics.map((topic, index) => (
                                    <span key={index}
                                          className="px-2 py-1 bg-purple-600 text-white text-sm rounded-full">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                            <a href={shownProject.url} target="_blank" rel="noopener noreferrer"
                               className="text-blue-300 hover:text-blue-200 transition-colors">
                                View on GitHub
                            </a>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className="flex justify-center items-center h-96">
                        <Loader2 className="w-12 h-12 text-white animate-spin"/>
                    </div>
                )}
                <div className="flex justify-center space-x-4 p-4 bg-white bg-opacity-5">
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        className="p-3 bg-red-500 rounded-full text-white shadow-lg"
                        onClick={() => handleFeedback("dislike")}
                        title="Dislike Project"
                    >
                        <X className="w-8 h-8"/>
                    </motion.button>
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        className="p-3 bg-yellow-500 rounded-full text-white shadow-lg"
                        onClick={() => handleFeedback("maybe")}
                        title="Maybe"
                    >
                        <HelpCircle className="w-8 h-8"/>
                    </motion.button>
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        className="p-3 bg-green-500 rounded-full text-white shadow-lg"
                        onClick={() => handleFeedback("like")}
                        title="Like Project"
                    >
                        <Heart className="w-8 h-8"/>
                    </motion.button>
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        className="p-3 bg-white rounded-full text-white shadow-lg"
                        onClick={handleStarring}
                        title="Save project"
                    >
                        <motion.div
                            initial={false}
                            animate={isCurrentStarred ? {scale: [1, 1.2, 1], rotate: [0, 15, -15, 0]} : {}}
                            transition={{duration: 0.5}}
                        >
                            <Star className={`w-8 h-8 text-yellow-500 ${isCurrentStarred ? "fill-yellow-500" : ""}`}/>
                        </motion.div>
                    </motion.button>
                </div>
            </div>
        </div>
    )
}