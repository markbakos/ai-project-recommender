import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Trash2, ExternalLink } from 'lucide-react'
import {Project} from "../types.ts";


export function Starred() {
    const [starredProjects, setStarredProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadStarredProjects = () => {
            const projects = JSON.parse(localStorage.getItem('starred_projects') || '[]')
            setStarredProjects(projects)
            setLoading(false)
        }

        loadStarredProjects()
    }, [])

    const removeProject = (url: string) => {
        const updatedProjects = starredProjects.filter(project => project.url !== url)
        setStarredProjects(updatedProjects)
        localStorage.setItem('starred_projects', JSON.stringify(updatedProjects))
    }

    return (
        <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-gray-800 to-purple-900 p-4">
            <div className="max-w-4xl mx-auto">
                <motion.h1
                    className="text-4xl font-bold text-white mb-8 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Starred Projects
                </motion.h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                ) : starredProjects.length === 0 ? (
                    <motion.p
                        className="text-white text-center text-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        No starred projects yet.
                    </motion.p>
                ) : (
                    <AnimatePresence>
                        {starredProjects.map((project, index) => (
                            <motion.div
                                key={project.url}
                                className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-xl overflow-hidden mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => removeProject(project.url)}
                                            className="text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </motion.button>
                                    </div>
                                    <p className="text-gray-300 mb-4">{project.description}</p>
                                    <div className="flex items-center mb-4">
                                        <Star className="w-5 h-5 text-yellow-500 mr-1" />
                                        <span className="text-white font-semibold">{project.stars}</span>
                                    </div>
                                    <p className="text-gray-300 mb-2">Language: {project.language}</p>
                                    <p className="text-gray-300 mb-4">Last updated: {new Date(project.last_updated).toLocaleDateString()}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.topics.map((topic, topicIndex) => (
                                            <span key={topicIndex} className="px-2 py-1 bg-purple-600 text-white text-sm rounded-full">
                        {topic}
                      </span>
                                        ))}
                                    </div>
                                    <motion.a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                                        whileHover={{ x: 5 }}
                                    >
                                        View on GitHub
                                        <ExternalLink size={16} className="ml-1" />
                                    </motion.a>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}

