import React from 'react';

const quotes = [
  {
    text: 'In investing, what is comfortable is rarely profitable.',
    author: 'Robert Arnott',
  },
  {
    text: 'The stock market is a device to transfer money from the impatient to the patient.',
    author: 'Warren Buffett',
  },
  {
    text: 'Risk comes from not knowing what you are doing.',
    author: 'Warren Buffett',
  },
  {
    text: 'Opportunities come infrequently. When it rains gold, put out the bucket, not the thimble.',
    author: 'Warren Buffett',
  },
  {
    text: 'Invest in yourself. Your career is the engine of your wealth.',
    author: 'Paul Clitheroe',
  },
  {
    text: 'An investment in knowledge pays the best interest.',
    author: 'Benjamin Franklin',
  },
  {
    text: 'The four most dangerous words in investing are: “This time it’s different.”',
    author: 'Sir John Templeton',
  },
  {
    text: 'Wide diversification is only required when investors do not understand what they are doing.',
    author: 'Warren Buffett',
  },
  {
    text: 'Price is what you pay. Value is what you get.',
    author: 'Warren Buffett',
  },
  {
    text: 'Know what you own, and know why you own it.',
    author: 'Peter Lynch',
  },
];

const FooterQuote = () => {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <footer className="border-t border-dark-gray/60 bg-primary-black/80">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center text-light-gray/70">
        <p className="text-lg md:text-xl text-off-white/90 italic mb-3">“{quote.text}”</p>
        <p className="text-sm uppercase tracking-[0.35em] text-light-gray/50">{quote.author}</p>
      </div>
    </footer>
  );
};

export default FooterQuote;
