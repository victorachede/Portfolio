import React, { useState, useEffect, useCallback } from 'react';
// Imports for necessary icons
import { FaSearch, FaArrowUp, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaPython, FaHtml5, FaReact, FaNodeJs, FaCopy } from 'react-icons/fa';
import { SiJavascript, SiCplusplus, SiMongodb, SiTailwindcss, SiTypescript, SiFirebase, SiRedux } from 'react-icons/si';

// --- Configuration ---
const DURATION = 5000; // 5 seconds for automatic dismissal

// --- Toast Notification System ---

/**
 * Toast component for displaying a single notification.
 */
const Toast = ({ id, message, type, onDismiss }) => {
    const isSuccess = type === 'success';
    const isError = type === 'error';
    const bgColor = isSuccess ? 'bg-green-600' : isError ? 'bg-red-600' : 'bg-cyan-600';
    
    // Using imported Fa icons for status
    const Icon = isSuccess ? FaCheckCircle : isError ? FaTimesCircle : FaExclamationCircle;

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(id);
        }, DURATION);
        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    return (
        <div 
            className={`flex items-center p-4 mb-3 w-full max-w-sm rounded-lg shadow-lg text-white transform transition-all duration-500 ease-out 
             ${bgColor} border-2 ${isSuccess ? 'border-green-400' : isError ? 'border-red-400' : 'border-cyan-400'}`}
            role="alert"
        >
            <Icon className="flex-shrink-0 w-6 h-6 mr-3" />
            <div className="text-sm font-medium flex-grow text-left">
                {message}
            </div>
            <button 
                type="button" 
                className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 text-white hover:bg-opacity-80`} 
                aria-label="Close"
                onClick={() => onDismiss(id)}
            >
                &times;
            </button>
        </div>
    );
};

/**
 * ToastContainer component manages and renders all active toasts.
 */
const ToastContainer = ({ toasts, onDismiss }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none md:max-w-xs w-full p-4 md:p-0">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast {...toast} onDismiss={onDismiss} />
                </div>
            ))}
        </div>
    );
};

// --- Mock SEO Component (Manages document title and meta description) ---
const SEO = ({ title, description }) => {
    useEffect(() => {
        document.title = title || "Courses";
        // Add basic meta description for demonstration
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'description';
            newMeta.content = description;
            document.head.appendChild(newMeta);
        }
    }, [title, description]);
    return null;
};

// --- Mock BackToTopButton Component ---
const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled up to a certain amount
    const toggleVisibility = () => {
        if (typeof window !== 'undefined' && window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll the page to the top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', toggleVisibility);
            return () => window.removeEventListener('scroll', toggleVisibility);
        }
    }, []);

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-4 right-4 p-3 rounded-full bg-cyan-600 text-white shadow-lg transition-opacity duration-300 z-50 hover:bg-cyan-700 ${
                isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll to top"
        >
            <FaArrowUp className="text-xl w-6 h-6" />
        </button>);
};


// --- Main Courses Component (App) ---

const Courses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
    const [showBankDetailsModal, setShowBankDetailsModal] = useState(false);
    const [courseToPayFor, setCourseToPayFor] = useState(null); // Stores details of the course being paid for
    
    // State for Toasts
    const [toasts, setToasts] = useState([]);
    
    // Memoized functions for toast management
    const dismissToast = useCallback((id) => {
        setToasts(prevToasts => prevToasts.filter(t => t.id !== id));
    }, []);
    
    const showToast = useCallback((message, type) => {
        const id = Date.now();
        setToasts(prevToasts => [
            ...prevToasts,
            { id, message, type, duration: DURATION }
        ]);
    }, []); // No need for dependencies other than stable setToasts

    // Public toast API replacement
    const toast = {
        success: (message) => showToast(message, 'success'),
        error: (message) => showToast(message, 'error'),
    };

    const keywords = [
        "Python", "JavaScript", "C++", "HTML", "CSS",
        "Redux", "Node.js", "React", "MongoDB", "SQL",
        "Tailwind CSS", "Firebase", "TypeScript", "Django", "Flask"
    ];

    // Dummy Course Data with Prices in Naira (₦) - Uses imported icons
    const coursesData = [
        {
            id: 'py001',
            icon: FaPython,
            title: 'Python for Beginners',
            description: 'Master the fundamentals of Python programming. Perfect for absolute beginners.',
            price: 25000, // Naira
            keywords: ['Python', 'Beginner', 'Programming']
        },
        {
            id: 'js001',
            icon: SiJavascript,
            title: 'JavaScript Essentials',
            description: 'Learn core JavaScript concepts, DOM manipulation, and modern syntax.',
            price: 30000,
            keywords: ['JavaScript', 'Frontend', 'Web Development']
        },
        {
            id: 'htcss01',
            icon: FaHtml5,
            title: 'HTML & CSS Fundamentals',
            description: 'Build responsive and beautiful web pages from scratch.',
            price: 20000,
            keywords: ['HTML', 'CSS', 'Frontend', 'Web Design']
        },
        {
            id: 'react01',
            icon: FaReact,
            title: 'React.js Crash Course',
            description: 'Develop dynamic user interfaces with React, Hooks, and Component-based architecture.',
            price: 35000,
            keywords: ['React', 'JavaScript', 'Frontend', 'UI/UX']
        },
        {
            id: 'node01',
            icon: FaNodeJs,
            title: 'Node.js & Express API',
            description: 'Build robust backend APIs with Node.js, Express, and integrate with databases.',
            price: 40000,
            keywords: ['Node.js', 'Express', 'Backend', 'API']
        },
        {
            id: 'redux01',
            icon: SiRedux, // FIX: Changed from FaRedux to SiRedux
            title: 'Redux State Management',
            description: 'Manage complex application state efficiently with Redux Toolkit.',
            price: 28000,
            keywords: ['Redux', 'React', 'State Management']
        },
        {
            id: 'cpp01',
            icon: SiCplusplus,
            title: 'C++ Basics to OOP',
            description: 'A comprehensive introduction to C++ programming and Object-Oriented Principles.',
            price: 32000,
            keywords: ['C++', 'Programming', 'OOP']
        },
        {
            id: 'mongo01',
            icon: SiMongodb,
            title: 'MongoDB Database',
            description: 'Learn NoSQL database concepts and how to use MongoDB with Node.js.',
            price: 27000,
            keywords: ['MongoDB', 'NoSQL', 'Database']
        },
        {
            id: 'tailwind01',
            icon: SiTailwindcss,
            title: 'Tailwind CSS Mastery',
            description: 'Rapidly build modern designs with utility-first CSS framework.',
            price: 22000,
            keywords: ['Tailwind CSS', 'CSS', 'Frontend', 'Design']
        },
        {
            id: 'ts01',
            icon: SiTypescript,
            title: 'TypeScript Fundamentals',
            description: 'Add static typing to your JavaScript projects for better scalability and maintainability.',
            price: 31000,
            keywords: ['TypeScript', 'JavaScript', 'Type Safety']
        },
        {
            id: 'firebase01',
            icon: SiFirebase,
            title: 'Firebase for Web',
            description: 'Build full-stack applications quickly using Firebase services like Firestore, Auth, and Storage.',
            price: 33000,
            keywords: ['Firebase', 'Backend', 'Authentication', 'Database']
        }
    ];

    // Filtered courses based on search term
    const filteredCourses = coursesData.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholderIndex(prevIndex => (prevIndex + 1) % keywords.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [keywords.length]);

    // Function to handle course selection which now initiates bank transfer process
    const handleSelectCourse = async (course) => {
        // 1. Store the course details and show the modal
        setCourseToPayFor(course);
        setShowBankDetailsModal(true);

        // 2. Send an immediate notification to Victor via Formspree about the user's intent to pay via bank transfer
        console.log(`Sending bank transfer intent via Formspree for: ${course.title} (ID: ${course.id})`);
        try {
            // Note: In a real application, you might dynamically inject user email/name here if available.
            const response = await fetch('https://formspree.io/f/mpwlryll', { // Your Formspree URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `Bank Transfer Payment Intent for: ${course.title}`,
                    course_title: course.title,
                    course_id: course.id,
                    message: `A visitor to your website is interested in enrolling in "${course.title}" (ID: ${course.id}) via bank transfer. Please expect payment proof to victorachede@gmail.com soon from their email.`
                }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Formspree Intent Response:', result.message || 'Success');
                toast.success(`You've chosen to enroll in "${course.title}". Check the pop-up for bank transfer details!`);
            } else {
                console.error('Formspree Intent Error:', result.errors || result.message || 'Unknown error from Formspree');
                toast.error(`Couldn't send notification about bank transfer for "${course.title}". Please try again.`);
            }
        } catch (error) {
            console.error('Network error sending bank transfer intent:', error);
            toast.error(`A network error occurred while preparing bank transfer for "${course.title}". Please check your internet connection.`);
        }
    };

    // Function to close the bank details modal
    const closeBankDetailsModal = () => {
        setShowBankDetailsModal(false);
        setCourseToPayFor(null); // Clear the selected course
    };
    
    // Utility function for copying text using document.execCommand
    const copyToClipboard = (text, successMessage) => {
        const tempElement = document.createElement('textarea');
        tempElement.value = text;
        // Set style to prevent visible element from breaking layout
        tempElement.style.position = 'absolute';
        tempElement.style.left = '-9999px';
        document.body.appendChild(tempElement);

        // Select the text
        tempElement.select();
        tempElement.setSelectionRange(0, 99999); // For mobile devices

        // Execute the copy command
        try {
            document.execCommand('copy');
            toast.success(successMessage);
        } catch (err) {
            console.error('Failed to copy text:', err);
            toast.error('Failed to copy. Please manually select the text.');
        } finally {
            // Remove the temporary element
            document.body.removeChild(tempElement);
        }
    };

    // Combined bank details string for a single copy button
    const bankDetails = `Account Name: Victor Achede
Account Number: 9040237109
Bank: OPAY`;


    return (
        <div className="overflow-x-hidden bg-gray-900 text-white min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Toast Notification Container */}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            <SEO
                title="Programming Courses | Learn to Code with Victor"
                description="Explore a variety of programming courses designed to help you learn and master coding. Find courses in Python, JavaScript, HTML, CSS, and more."
                ogImage="/og.png"
                ogUrl="https://victor-achede.vercel.app/courses"
                keywords="programming courses, learn code, Python, JavaScript, HTML, CSS, Redux, C++, C#, coding tutorials, online learning, programming education"
            />
            
            {/* Main Content Section */}
            <section className="max-w-6xl mx-auto w-full flex-grow px-0 sm:px-0">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-cyan-400 text-center mb-10 sm:mb-12 leading-tight">
                    Master Your Code Journey
                </h1>

                {/* Search Bar Section - Optimized for mobile padding */}
                <div className="mb-12 relative mx-auto max-w-xl px-4 sm:px-0">
                    <input
                        type="text"
                        placeholder={`Search courses like ${keywords[currentPlaceholderIndex]}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white text-base sm:text-lg placeholder-gray-400 transition duration-300 ease-in-out shadow-inner"
                    />
                    <FaSearch
                        className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 text-xl w-6 h-6"
                    />
                </div>

                {/* Course Cards Grid - Ensure good mobile layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 px-4 sm:px-0">
                    {filteredCourses.map(course => (
                        <div key={course.id} className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition duration-500 transform hover:scale-[1.02] flex flex-col">
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="text-cyan-400 text-6xl mb-4 flex justify-center">
                                        {/* Render the imported icon component */}
                                        <course.icon className="w-16 h-16"/>
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-white mb-2 text-center">{course.title}</h3>
                                    <p className="text-gray-400 text-center text-sm mb-4">{course.description}</p>
                                </div>
                                {/* Keywords Tagging */}
                                <div className="flex justify-center flex-wrap gap-2 mt-2">
                                    {course.keywords.slice(0, 3).map(keyword => (
                                        <span key={keyword} className="text-xs font-medium bg-gray-700 text-cyan-300 px-3 py-1 rounded-full">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Price and Button Footer */}
                            <div className="bg-gray-900 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-700">
                                <span className="text-white text-2xl font-bold">
                                    ₦{course.price.toLocaleString()}
                                </span>
                                <button
                                    onClick={() => handleSelectCourse(course)}
                                    className="w-full sm:w-auto px-4 py-2 text-base bg-cyan-600 text-white rounded-full font-semibold hover:bg-cyan-700 transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                                >
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Other Courses Available Soon */}
                <div className="text-center bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700 mx-4 sm:mx-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-4">More Courses Coming Soon!</h2>
                    <p className="text-gray-300 text-base sm:text-lg">
                        We are constantly expanding our curriculum to bring you the best in programming education. Stay tuned for exciting new courses in areas like Machine Learning, Data Science, Game Development, and more!
                    </p>
                    <p className="text-gray-400 text-sm mt-4">
                        Follow us on social media for updates!
                    </p>
                </div>
            </section>

            {/* Bank Details Modal - Optimized for Mobile & Copy Utility */}
            {showBankDetailsModal && courseToPayFor && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-2 sm:p-4 z-50 transition-opacity duration-300">
                    <div className="bg-gray-800 rounded-xl p-6 sm:p-8 max-w-sm sm:max-w-lg w-full text-center relative border border-cyan-600 shadow-2xl">
                        <button
                            onClick={closeBankDetailsModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-cyan-400 text-3xl font-bold transition duration-200"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-4">
                            Enroll in "{courseToPayFor.title}"
                        </h2>
                        <p className="text-base sm:text-xl text-gray-300 mb-6">
                            Please make a secure bank transfer of <span className="text-cyan-400 font-extrabold">₦{courseToPayFor.price.toLocaleString()}</span> to the details below.
                        </p>

                        {/* Account Details Block with Single Copy Button */}
                        <div className="bg-gray-900 p-5 rounded-lg mb-6 text-left border border-gray-700 shadow-inner relative">
                            <p className="text-base sm:text-lg text-white mb-2">
                                <strong className="text-cyan-400">Name:</strong> Victor Achede
                            </p>
                            
                            <p className="text-base sm:text-lg text-white mb-2">
                                <strong className="text-cyan-400">Number:</strong> 9040237109
                            </p>
                            
                            <p className="text-base sm:text-lg text-white">
                                <strong className="text-cyan-400">Bank:</strong> OPAY
                            </p>
                            
                            {/* Single Copy Button for all details */}
                            <button
                                onClick={() => copyToClipboard(bankDetails, 'All Bank Details Copied!')}
                                className="absolute top-3 right-3 text-gray-400 hover:text-cyan-300 font-bold p-2 rounded-lg transition duration-200 bg-gray-700 hover:bg-gray-600"
                                title="Copy All Bank Details"
                            >
                                <FaCopy className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-400 mb-6 text-sm sm:text-base">
                            <strong className="text-cyan-400">NEXT STEP:</strong> Email your payment proof (screenshot/receipt) to:
                            <br />
                            <a href="mailto:victorachede@gmail.com" className="text-cyan-400 hover:underline font-semibold text-xl block mt-1">victorachede@gmail.com</a>
                            <span className="block mt-2 text-xs text-gray-500">(Enrollment is confirmed upon receipt of proof.)</span>
                        </p>

                        <button
                            onClick={closeBankDetailsModal}
                            className="w-full sm:w-auto px-8 py-3 bg-cyan-600 text-white rounded-full font-extrabold hover:bg-cyan-700 transition duration-300 ease-in-out transform hover:scale-[1.02] shadow-xl"
                        >
                            Transfer
                        </button>
                    </div>
                </div>
            )}

            <BackToTopButton />
        </div>
    );
};

export default Courses;