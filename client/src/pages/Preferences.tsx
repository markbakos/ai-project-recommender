import {AnimatePresence, motion} from "framer-motion"
import {useEffect, useState} from 'react'
import {X} from "lucide-react";

export const Preferences = () => {

    const [tags, setTags] = useState<string[]>([])
    const [currentTag, setCurrentTag] = useState('')
    const [minStars, setMinStars] = useState(0)
    const [maxStars, setMaxStars] = useState(30000)
    const [serverURL, setServerURL] = useState('http://127.0.0.1:8000')

    useEffect(() => {
        const tagsStorage = localStorage.getItem('tags') ?? "python,machine-learning"
        const min_starsStorage = parseInt(localStorage.getItem('min_stars') ?? '0')
        const max_starsStorage = parseInt(localStorage.getItem('max_stars') ?? '30000')
        setServerURL(localStorage.getItem('server_url') ?? "http://127.0.0.1:8000")

        setTags(tagsStorage.split(','))
        setMinStars(min_starsStorage)
        setMaxStars(max_starsStorage)

    }, [])

    const addTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            const newTags = [...tags, currentTag.toLowerCase().replace(" ", "-")]
            setTags(newTags)
            setCurrentTag('')
            localStorage.setItem('tags', newTags.join(','))
        }
    }

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove)
        setTags(newTags)
        localStorage.setItem('tags', newTags.join(','))
    }

    const savePreferences = () => {
        const adjustedMinStars = minStars >= maxStars ? maxStars - 1 : minStars
        const adjustedMaxStars = maxStars <= minStars ? minStars + 1 : maxStars

        setMinStars(adjustedMinStars)
        setMaxStars(adjustedMaxStars)

        localStorage.setItem('min_stars', adjustedMinStars.toString())
        localStorage.setItem('max_stars', adjustedMaxStars.toString())
        localStorage.setItem('server_url', serverURL)
    }

    return (
        <div
            className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-gray-800 to-purple-900 flex justify-center items-center p-4">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-6"
            >
                <h1 className="text-3xl font-bold text-white mb-6">Preferences</h1>

                <div className="mb-6">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                        Tags
                    </label>
                    <div className="flex items-center mb-2">
                        <input
                            type="text"
                            id="tags"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            className="flex-grow bg-gray-700 text-white rounded-l-md border-0 focus:ring-2 focus:ring-purple-600 px-4 py-2"
                            placeholder="Add a tag"
                        />
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            onClick={addTag}
                            className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors"
                        >
                            Add
                        </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {tags.map(tag => (
                                <motion.span
                                    key={tag}
                                    initial={{opacity: 0, scale: 0.8}}
                                    animate={{opacity: 1, scale: 1}}
                                    exit={{opacity: 0, scale: 0.8}}
                                    className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm flex items-center"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-2 focus:outline-none"
                                    >
                                        <X size={14}/>
                                    </button>
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="minStars" className="block text-sm font-medium text-gray-300 mb-2">
                        Minimum Stars
                    </label>
                    <input
                        type="number"
                        id="minStars"
                        min="0"
                        max={maxStars - 1}
                        value={minStars}
                        onChange={(e) => setMinStars(Number(e.target.value))}
                        className="w-full bg-gray-700 text-white rounded-md border-0 focus:ring-2 focus:ring-purple-600 px-4 py-2"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="maxStars" className="block text-sm font-medium text-gray-300 mb-2">
                        Maximum Stars
                    </label>
                    <input
                        type="number"
                        id="maxStars"
                        value={maxStars}
                        min={minStars + 1}
                        max="50000"
                        onChange={(e) => setMaxStars(Number(e.target.value))}
                        className="w-full bg-gray-700 text-white rounded-md border-0 focus:ring-2 focus:ring-purple-600 px-4 py-2"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="serverURL" className="block text-sm font-medium text-gray-300 mb-2">
                        Server URL
                    </label>
                    <input
                        type="text"
                        id="serverURL"
                        value={serverURL}
                        onChange={(e) => setServerURL(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-md border-0 focus:ring-2 focus:ring-purple-600 px-4 py-2"
                    />
                </div>
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    onClick={savePreferences}
                >
                    Save Preferences
                </motion.button>
            </motion.div>
        </div>
    )
}