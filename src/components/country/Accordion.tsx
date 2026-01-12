import { useState } from 'react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export const Accordion = ({ items }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="border rounded-2xl p-4 bg-white"
        >
          <button
            className="flex justify-between items-center w-full text-left p-4 font-medium"
            onClick={() => toggleAccordion(index)}
          >
            <span>{item.question}</span>
            <span className="ml-4">
              {openIndex === index ? '−' : '+'}
            </span>
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 pt-2 border-t border-gray-200 text-gray-600">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};