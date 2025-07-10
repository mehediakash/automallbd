import React from "react";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

const TeamPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      role: 'CEO & Founder',
      image: 'https://i.ibb.co.com/MD4hT6mR/Screenshot-2.png',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
      },
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'CTO',
      image: 'https://i.ibb.co.com/MD4hT6mR/Screenshot-2.png',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
      },
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Lead Developer',
      image: 'https://i.ibb.co.com/MD4hT6mR/Screenshot-2.png',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#091017] py-12 px-4 sm:px-6 lg:px-8 md:mt-14 mt-5">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-extrabold !text-white text-center mb-8    text-transparent"
        >
          Our Amazing Team
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              </div>

              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-4">{member.role}</p>

                <div className="flex justify-center space-x-4">
                  <motion.a
                    href={member.social.twitter}
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <FiTwitter size={24} />
                  </motion.a>
                  <motion.a
                    href={member.social.linkedin}
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-400 hover:text-blue-700 transition-colors"
                  >
                    <FiLinkedin size={24} />
                  </motion.a>
                  <motion.a
                    href={member.social.github}
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <FiGithub size={24} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;