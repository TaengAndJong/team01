


export const fallbackImg = (e, fallback = '/images/noimg.jpg') => {
   console.log(" e.target.onerror", e.target.onerror);
    e.target.onerror = null;
    e.target.src = fallback;
};
