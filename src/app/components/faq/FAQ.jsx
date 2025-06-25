'use client';
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {

    const faqData = [
        {
            question: "What shipping options do you offer?",
            answer: "We offer standard, express, and overnight shipping options."
        },
        {
            question: "How can I track my shipment?",
            answer: "Once your order ships, we’ll send a tracking number via email."
        },
        {
            question: "What are your delivery times?",
            answer: "Delivery times depend on your location and shipping method selected."
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(index === openIndex ? null : index);
    };


    return (
        <section className="mt-20 text-center px-4 max-w-2xl mx-auto">
            <h1 className="text-[#3C4D03] text-3xl font-bold">Frequently Asked Questions</h1>
            <p className="text-[#3C4D03] mt-5 mr-12 ml-15 sm:text-xl">Find answers to common questions about our services.</p>

            <div className="mt-10 text-left space-y-4">
                {faqData.map((item, index) => (
                    <div key={index} className="border-b border-green-900 pb-4">
                        <button
                            className="w-full text-left"
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="flex justify-between items-center w-full text-lg font-medium text-[#3c4d03]">
                                {item.question}
                                {openIndex === index ? (
                                    <ChevronUp className="w-5 h-5" />
                                ) : (
                                    <ChevronDown className="w-5 h-5" />
                                )}
                            </div>
                        </button>
                        {openIndex === index && (
                            <p className="mt-2 text-gray-700">{item.answer}</p>
                        )}
                    </div>

                ))}
            </div>

        </section>
    );
}