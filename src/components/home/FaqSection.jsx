"use client"

import React, { useState } from 'react';
import { Plus, Minus } from "lucide-react";

const FaqSection = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = [
    {
      id: "item-1",
      question: "What is my Pigeon Records?",
      answer: "Pigeon Records is a comprehensive platform designed to help you manage, track, and organize your records efficiently. Whether you're dealing with business records, personal documents, or any other type of data management, we provide powerful tools to help you organize and showcase. Our mission is to make pigeon management simple, smart, and reliable. From monitoring pedigrees to tracking race results, we provide powerful tools to help you organize and showcase."
    },
    {
      id: "item-2",
      question: "How many landing page can I work with your project?",
      answer: "You can create and manage multiple landing pages with our project. The exact number depends on your subscription plan and specific requirements. Contact our support team for detailed information about landing page limits."
    },
    {
      id: "item-3",
      question: "How many landing page can I work with your project?",
      answer: "You can create and manage multiple landing pages with our project. The exact number depends on your subscription plan and specific requirements. Contact our support team for detailed information about landing page limits."
    },
    {
      id: "item-4",
      question: "How many landing page can I work with your project?",
      answer: "You can create and manage multiple landing pages with our project. The exact number depends on your subscription plan and specific requirements. Contact our support team for detailed information about landing page limits."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          <span className="text-cyan-400">Frequently</span>
        </h2>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Asked Questions
        </h2>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqData.map((faq) => {
          const isOpen = openItems[faq.id];
          
          return (
            <div 
              key={faq.id}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-4 py-4 text-left font-medium text-gray-700 hover:text-cyan-500 transition-colors duration-300 flex items-center justify-between"
              >
                <span className="text-sm md:text-base pr-4">{faq.question}</span>
                <div className="flex-shrink-0">
                  {isOpen ? (
                    <Minus className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Answer */}
              {isOpen && (
                <div className="px-4 pb-4 pt-2">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqSection;
