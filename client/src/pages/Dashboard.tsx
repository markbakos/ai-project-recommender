import {Link} from "react-router-dom"
import {Settings, Sparkles, Star} from "lucide-react"
import { motion } from "framer-motion"


export const Dashboard = () => {
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-800 to-purple-900 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <motion.h1
                    className="text-4xl font-bold text-white mb-8 text-center"
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    Dashboard
                </motion.h1>
                <motion.div
                    className="grid gap-6 md:grid-cols-3"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5, delay: 0.2}}
                >
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.4}}
                    >
                        <Link
                            to="/"
                            className="bg-white bg-opacity-10 rounded-lg p-6 text-white hover:bg-opacity-20 transition-all duration-300 flex flex-col items-center justify-center text-center"
                        >
                            <motion.button
                                className="flex flex-col items-center"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <Star className="w-12 h-12 mb-4"/>
                                <h2 className="text-xl font-semibold">Starred</h2>
                            </motion.button>
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.3}}
                    >
                        <Link
                            to="/"
                            className="bg-white bg-opacity-10 rounded-lg p-6 text-white hover:bg-opacity-20 transition-all duration-300 flex flex-col items-center justify-center text-center"
                        >
                            <motion.button
                                className="flex flex-col items-center"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <Sparkles className="w-12 h-12 mb-4 text-yellow-500"/>
                                <h2 className="text-xl font-semibold text-yellow-500">Recommender</h2>
                            </motion.button>
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.5}}
                    >
                        <Link
                            to="/"
                            className="bg-white bg-opacity-10 rounded-lg p-6 text-white hover:bg-opacity-20 transition-all duration-300 flex flex-col items-center justify-center text-center"
                        >
                            <motion.button
                                className="flex flex-col items-center"
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <Settings className="w-12 h-12 mb-4"/>
                                <h2 className="text-xl font-semibold">AI Preferences</h2>
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}