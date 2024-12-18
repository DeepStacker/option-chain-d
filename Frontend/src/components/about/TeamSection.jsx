import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

const TeamSection = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [selectedMember, setSelectedMember] = useState(null);

  const team = [
    {
      name: 'Alex Thompson',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=60',
      bio: 'Alex leads our development team with over 10 years of experience in financial technology.',
      skills: ['React', 'Node.js', 'Python', 'Financial Analysis'],
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    },
    {
      name: 'Sarah Chen',
      role: 'Data Scientist',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=60',
      bio: 'Sarah specializes in machine learning and predictive analytics for market trends.',
      skills: ['Machine Learning', 'Data Analysis', 'R', 'Python'],
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    },
    {
      name: 'Michael Rodriguez',
      role: 'UX Designer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&fit=crop&q=60',
      bio: 'Michael creates intuitive and beautiful interfaces that make complex data easy to understand.',
      skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    },
    {
      name: 'Emily Parker',
      role: 'Financial Analyst',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&fit=crop&q=60',
      bio: 'Emily brings deep financial market knowledge and risk analysis expertise to our team.',
      skills: ['Financial Analysis', 'Risk Management', 'Market Research', 'Trading'],
      social: {
        linkedin: '#',
        github: '#',
        twitter: '#'
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className={`mb-16 rounded-lg shadow-lg p-8 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <h2 className={`text-3xl font-bold mb-12 text-center ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        Meet Our Team
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedMember(member)}
            className={`cursor-pointer rounded-lg overflow-hidden shadow-md transition-all ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="relative group">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
            </div>
            <div className="p-4">
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                {member.name}
              </h3>
              <p className={`${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {member.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-2xl w-full rounded-lg shadow-xl p-6 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-full md:w-1/3 h-48 md:h-auto object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {selectedMember.name}
                  </h3>
                  <p className={`text-lg font-medium mb-4 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {selectedMember.role}
                  </p>
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {selectedMember.bio}
                  </p>
                  <div className="mb-4">
                    <h4 className={`font-semibold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={selectedMember.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-2xl ${
                        theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                      }`}
                    >
                      <FaLinkedin />
                    </a>
                    <a
                      href={selectedMember.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-2xl ${
                        theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'
                      }`}
                    >
                      <FaGithub />
                    </a>
                    <a
                      href={selectedMember.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-2xl ${
                        theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-400'
                      }`}
                    >
                      <FaTwitter />
                    </a>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className={`mt-6 px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default TeamSection;
