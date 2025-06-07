import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  lazy,
  Suspense,
  useEffect,
  useRef,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTimes,
  FaExternalLinkAlt,
  FaQuoteLeft,
} from "react-icons/fa";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

// Lazy load components for better performance
// const TeamMemberModal = lazy(() => import("./TeamMemberModal"));

// Professional team data with comprehensive information
const TEAM_DATA = [
  {
    id: "shivam-kumar",
    name: "Shivam Kumar",
    role: "Founder & Lead Developer",
    department: "Engineering",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80",
    bio: "Full-stack developer passionate about building intelligent trading systems. Specializes in React, Python, and machine learning applications for financial markets.",
    longBio:
      "Shivam is a BCA student at Dayananda Sagar Business Academy with extensive experience in full-stack development. He has built multiple trading applications including option chain analyzers and e-commerce platforms. His expertise spans across modern web technologies and financial market analysis.",
    skills: [
      "React.js",
      "Python",
      "FastAPI",
      "Machine Learning",
      "Trading Systems",
      "Data Science",
    ],
    experience: "2+ years",
    location: "Bangalore, India",
    education: "BCA, Dayananda Sagar Business Academy",
    achievements: [
      "Built production-ready option chain analyzer",
      "Developed intelligent trading systems",
      "Created multiple full-stack applications",
    ],
    quote:
      "Building technology that removes emotions from trading and bases decisions on data and logic.",
    social: {
      linkedin: "https://linkedin.com/in/shivam-kumar",
      github: "https://github.com/shivam-kumar",
      twitter: "https://twitter.com/shivam_kumar",
      email: "shivam@deepstrike.com",
    },
    availability: "Available",
    timezone: "IST (UTC+5:30)",
  },
  {
    id: "alex-thompson",
    name: "Alex Thompson",
    role: "Senior Data Scientist",
    department: "Analytics",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80",
    bio: "Expert in machine learning and quantitative analysis with 8+ years in financial technology. Specializes in algorithmic trading and risk management.",
    longBio:
      "Alex brings deep expertise in quantitative finance and machine learning to our team. With a PhD in Financial Engineering, he has developed sophisticated trading algorithms for major investment firms.",
    skills: [
      "Python",
      "R",
      "TensorFlow",
      "Quantitative Analysis",
      "Risk Management",
      "SQL",
    ],
    experience: "8+ years",
    location: "New York, USA",
    education: "PhD Financial Engineering, Stanford University",
    achievements: [
      "Published 15+ research papers on algorithmic trading",
      "Developed ML models with 85%+ accuracy",
      "Led data science teams at Fortune 500 companies",
    ],
    quote:
      "Data is the new oil, but insights are the refined fuel that powers intelligent decisions.",
    social: {
      linkedin: "https://linkedin.com/in/alex-thompson",
      github: "https://github.com/alex-thompson",
      twitter: "https://twitter.com/alex_thompson",
      email: "alex@deepstrike.com",
    },
    availability: "Available",
    timezone: "EST (UTC-5)",
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "Lead UX Designer",
    department: "Design",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80",
    bio: "Creative designer focused on making complex financial data accessible and intuitive. Expert in user research and interface design.",
    longBio:
      "Sarah specializes in creating user-centered designs for complex financial applications. Her work focuses on making sophisticated trading tools accessible to both professional and retail traders.",
    skills: [
      "UI/UX Design",
      "Figma",
      "User Research",
      "Prototyping",
      "Design Systems",
      "Adobe Creative Suite",
    ],
    experience: "6+ years",
    experience: "6+ years",
    location: "San Francisco, USA",
    education: "MS Human-Computer Interaction, Carnegie Mellon",
    achievements: [
      "Designed award-winning trading interfaces",
      "Improved user engagement by 40%",
      "Led design for 50+ financial applications",
    ],
    quote:
      "Great design is invisible – it just works, especially when dealing with complex financial data.",
    social: {
      linkedin: "https://linkedin.com/in/sarah-chen",
      github: "https://github.com/sarah-chen",
      twitter: "https://twitter.com/sarah_chen",
      email: "sarah@deepstrike.com",
    },
    availability: "Available",
    timezone: "PST (UTC-8)",
  },
  {
    id: "michael-rodriguez",
    name: "Michael Rodriguez",
    role: "DevOps Engineer",
    department: "Infrastructure",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&fit=crop&q=80",
    bio: "Infrastructure specialist ensuring our trading systems run reliably at scale. Expert in cloud architecture and real-time data processing.",
    longBio:
      "Michael ensures our trading infrastructure can handle high-frequency data and provide real-time analytics. He specializes in building scalable, fault-tolerant systems for financial applications.",
    skills: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Redis",
      "Kafka",
      "Monitoring",
      "CI/CD",
    ],
    experience: "7+ years",
    location: "Austin, USA",
    education: "BS Computer Science, University of Texas",
    achievements: [
      "Built systems handling 1M+ requests/second",
      "Achieved 99.99% uptime for trading systems",
      "Reduced infrastructure costs by 35%",
    ],
    quote:
      "Reliability is not just a feature – it's the foundation of trust in financial systems.",
    social: {
      linkedin: "https://linkedin.com/in/michael-rodriguez",
      github: "https://github.com/michael-rodriguez",
      twitter: "https://twitter.com/michael_rodriguez",
      email: "michael@deepstrike.com",
    },
    availability: "Available",
    timezone: "CST (UTC-6)",
  },
];

// Enhanced Error Boundary Fallback
const TeamErrorFallback = memo(({ error, resetErrorBoundary, theme }) => (
  <div
    className={`p-8 text-center rounded-lg ${
      theme === "dark"
        ? "bg-gray-800 text-gray-300"
        : "bg-gray-50 text-gray-600"
    }`}
  >
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">
        Unable to load team information
      </h3>
      <p className="text-sm mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          theme === "dark"
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        Try Again
      </button>
    </div>
  </div>
));

TeamErrorFallback.displayName = "TeamErrorFallback";

// Loading Skeleton Component
const TeamMemberSkeleton = memo(({ theme }) => (
  <div
    className={`rounded-xl overflow-hidden ${
      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
    } animate-pulse`}
  >
    <div
      className={`h-64 ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}
    />
    <div className="p-6">
      <div
        className={`h-4 ${
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
        } rounded mb-2`}
      />
      <div
        className={`h-3 ${
          theme === "dark" ? "bg-gray-600" : "bg-gray-200"
        } rounded w-2/3`}
      />
    </div>
  </div>
));

TeamMemberSkeleton.displayName = "TeamMemberSkeleton";

// Enhanced Team Member Card Component
const TeamMemberCard = memo(
  ({ member, index, theme, onMemberClick, isLoading = false }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
    }, []);

    const handleImageError = useCallback(() => {
      setImageError(true);
      setImageLoaded(true);
    }, []);

    const handleCardClick = useCallback(() => {
      onMemberClick(member);
    }, [member, onMemberClick]);

    const handleKeyPress = useCallback(
      (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      },
      [handleCardClick]
    );

    if (isLoading) {
      return <TeamMemberSkeleton theme={theme} />;
    }

    const cardVariants = {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
    };

    return (
      <motion.div
        variants={cardVariants}
        whileHover={{
          y: -8,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCardClick}
        onKeyPress={handleKeyPress}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${member.name}, ${member.role}`}
        className={`group cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 ${
          theme === "dark"
            ? "bg-gray-800 hover:bg-gray-750 shadow-gray-900/20 focus:ring-blue-500/30"
            : "bg-white hover:bg-gray-50 shadow-gray-200/50 focus:ring-blue-500/30"
        } hover:shadow-2xl`}
      >
        {/* Image Section */}
        <div className="relative overflow-hidden">
          {!imageLoaded && (
            <div
              className={`absolute inset-0 ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-200"
              } animate-pulse`}
            />
          )}

          {imageError ? (
            <div
              className={`h-64 flex items-center justify-center ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">👤</div>
                <p className="text-sm">Image unavailable</p>
              </div>
            </div>
          ) : (
            <img
              src={member.image}
              alt={`${member.name} - ${member.role}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-64 object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions Overlay */}
          <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex justify-center space-x-3">
              {member.social.linkedin && (
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  aria-label={`${member.name}'s LinkedIn profile`}
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
              )}
              {member.social.github && (
                <a
                  href={member.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  aria-label={`${member.name}'s GitHub profile`}
                >
                  <FaGithub className="w-4 h-4" />
                </a>
              )}
              {member.social.email && (
                <a
                  href={`mailto:${member.social.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  aria-label={`Email ${member.name}`}
                >
                  <FaEnvelope className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Availability Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                member.availability === "Available"
                  ? "bg-green-500/90 text-white"
                  : "bg-orange-500/90 text-white"
              }`}
            >
              {member.availability}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="mb-3">
            <h3
              className={`text-xl font-bold mb-1 group-hover:text-blue-500 transition-colors ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {member.name}
            </h3>
            <p
              className={`text-sm font-medium ${
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {member.role}
            </p>
            <p
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {member.department} • {member.experience}
            </p>
          </div>

          <p
            className={`text-sm leading-relaxed mb-4 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {member.bio}
          </p>

          {/* Skills Preview */}
          <div className="flex flex-wrap gap-1 mb-4">
            {member.skills.slice(0, 3).map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {skill}
              </span>
            ))}
            {member.skills.length > 3 && (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  theme === "dark"
                    ? "bg-blue-900/30 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                +{member.skills.length - 3} more
              </span>
            )}
          </div>

          {/* Location */}
          <div
            className={`flex items-center text-xs ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <FaMapMarkerAlt className="w-3 h-3 mr-1" />
            {member.location}
          </div>
        </div>
      </motion.div>
    );
  }
);

TeamMemberCard.displayName = "TeamMemberCard";

TeamMemberCard.propTypes = {
  member: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  theme: PropTypes.string.isRequired,
  onMemberClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

// Enhanced Team Member Modal
const EnhancedTeamMemberModal = memo(({ member, onClose, theme }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleContactClick = useCallback((type, value) => {
    switch (type) {
      case "email":
        window.open(`mailto:${value}`, "_blank");
        break;
      case "phone":
        window.open(`tel:${value}`, "_blank");
        break;
      default:
        window.open(value, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-2xl object-cover shadow-lg"
              />
            </div>

            <div className="flex-1">
              <h2
                id="modal-title"
                className={`text-3xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {member.name}
              </h2>
              <p
                className={`text-lg font-medium mb-2 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {member.role}
              </p>
              <p
                className={`text-sm mb-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {member.department} • {member.experience} • {member.location}
              </p>

              {/* Quote */}
              {member.quote && (
                <div
                  className={`relative p-4 rounded-lg italic ${
                    theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <FaQuoteLeft
                    className={`absolute top-2 left-2 text-lg ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`pl-6 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {member.quote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bio */}
          <div>
            <h3
              className={`text-lg font-semibold mb-3 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              About
            </h3>
            <p
              className={`leading-relaxed ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {member.longBio}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3
              className={`text-lg font-semibold mb-3 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {member.achievements && (
            <div>
              <h3
                className={`text-lg font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Key Achievements
              </h3>
              <ul className="space-y-2">
                {member.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className={`flex items-start ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Education & Contact */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3
                className={`text-lg font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Education
              </h3>
              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {member.education}
              </p>
            </div>

            <div>
              <h3
                className={`text-lg font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Connect
              </h3>
              <div className="flex flex-wrap gap-3">
                {member.social.linkedin && (
                  <button
                    onClick={() =>
                      handleContactClick("linkedin", member.social.linkedin)
                    }
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    <FaLinkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                    <FaExternalLinkAlt className="w-3 h-3 ml-2" />
                  </button>
                )}
                {member.social.github && (
                  <button
                    onClick={() =>
                      handleContactClick("github", member.social.github)
                    }
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-600 hover:bg-gray-700 text-white"
                    }`}
                  >
                    <FaGithub className="w-4 h-4 mr-2" />
                    GitHub
                    <FaExternalLinkAlt className="w-3 h-3 ml-2" />
                  </button>
                )}
                {member.social.email && (
                  <button
                    onClick={() =>
                      handleContactClick("email", member.social.email)
                    }
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      theme === "dark"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    <FaEnvelope className="w-4 h-4 mr-2" />
                    Email
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

EnhancedTeamMemberModal.displayName = "EnhancedTeamMemberModal";

// Main Team Section Component
const TeamSection = memo(
  ({
    teamData = TEAM_DATA,
    title = "Meet Our Team",
    subtitle = "The brilliant minds behind DeepStrike's innovative trading solutions",
    showStats = true,
    className = "",
  }) => {
    const theme = useSelector((state) => state.theme?.theme || "light");
    const [selectedMember, setSelectedMember] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Simulate loading for demonstration
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

    const handleMemberClick = useCallback((member) => {
      setSelectedMember(member);
      // Analytics tracking
      if (typeof gtag !== "undefined") {
        gtag("event", "team_member_view", {
          member_name: member.name,
          member_role: member.role,
        });
      }
    }, []);

    const handleCloseModal = useCallback(() => {
      setSelectedMember(null);
    }, []);

    // Animation variants
    const containerVariants = useMemo(
      () => ({
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }),
      []
    );

    const headerVariants = useMemo(
      () => ({
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }),
      []
    );

    // Team statistics
    const teamStats = useMemo(
      () => ({
        totalMembers: teamData.length,
        departments: [...new Set(teamData.map((member) => member.department))]
          .length,
        totalExperience: teamData.reduce((sum, member) => {
          const exp = parseInt(member.experience.replace(/\D/g, "")) || 0;
          return sum + exp;
        }, 0),
        locations: [
          ...new Set(
            teamData.map(
              (member) =>
                member.location.split(",")[1]?.trim() || member.location
            )
          ),
        ].length,
      }),
      [teamData]
    );

    return (
      <ErrorBoundary
        FallbackComponent={(props) => (
          <TeamErrorFallback {...props} theme={theme} />
        )}
        onError={(error) => {
          console.error("TeamSection Error:", error);
          toast.error("Failed to load team section");
        }}
      >
        <motion.section
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className={`py-16 ${className}`}
          aria-labelledby="team-section-title"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div variants={headerVariants} className="text-center mb-16">
              <h2
                id="team-section-title"
                className={`text-4xl md:text-5xl font-bold mb-6 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h2>
              <p
                className={`text-xl max-w-3xl mx-auto leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {subtitle}
              </p>

              {/* Team Statistics */}
              {showStats && (
                <motion.div
                  variants={headerVariants}
                  className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto p-6 rounded-2xl ${
                    theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {teamStats.totalMembers}
                    </div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Team Members
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {teamStats.departments}
                    </div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Departments
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        theme === "dark" ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {teamStats.totalExperience}+
                    </div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        theme === "dark" ? "text-orange-400" : "text-orange-600"
                      }`}
                    >
                      {teamStats.locations}
                    </div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Global Locations
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Team Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {isLoading
                ? // Loading skeletons
                  Array.from({ length: 4 }, (_, index) => (
                    <TeamMemberSkeleton key={index} theme={theme} />
                  ))
                : // Team member cards
                  teamData.map((member, index) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      index={index}
                      theme={theme}
                      onMemberClick={handleMemberClick}
                    />
                  ))}
            </motion.div>
          </div>

          {/* Enhanced Modal */}
          <AnimatePresence>
            {selectedMember && (
              <Suspense
                fallback={
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div
                      className={`p-6 rounded-lg ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto"></div>
                      <p
                        className={`mt-2 text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Loading profile...
                      </p>
                    </div>
                  </div>
                }
              >
                <EnhancedTeamMemberModal
                  member={selectedMember}
                  onClose={handleCloseModal}
                  theme={theme}
                />
              </Suspense>
            )}
          </AnimatePresence>
        </motion.section>
      </ErrorBoundary>
    );
  }
);

TeamSection.displayName = "TeamSection";

TeamSection.propTypes = {
  teamData: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showStats: PropTypes.bool,
  className: PropTypes.string,
};

export default TeamSection;

