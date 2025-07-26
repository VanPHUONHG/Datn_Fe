import React from 'react'

const Trending = () => {
    return (
        // <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 md:gap-8">
        //     <div className="relative w-full md:w-72 flex-shrink-0">
        //         <img
        //             alt="White sneaker shoe..."
        //             className="w-full h-auto object-cover max-h-[325px] transition-transform duration-300 hover:scale-105"
        //             src="image/poster-giay-nike.jpg"
        //         />
        //         <button className="absolute top-20 left-6 bg-teal-600 text-white text-xs font-semibold px-3 py-1 rounded hover:bg-teal-700 hover:scale-105 transition duration-300">
        //             Shop Now
        //         </button>
        //         <div className="absolute bottom-20 right-6 text-yellow  text-l font-bold" style={{ lineHeight: 1 }}>
        //             40%
        //             <br />
        //             discount
        //         </div>
        //     </div>
        //     <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        //         <section>
        //             <div className="flex items-center justify-center gap-1 mb-4 text-sm font-semibold text-gray-600">
        //                 <button aria-label="Previous trending items" className="text-gray-400 hover:text-teal-600">
        //                     <i className="fas fa-chevron-left"></i>
        //                 </button>
        //                 <span>
        //                     Trending
        //                     <span className="text-teal-600">
        //                         Items
        //                     </span>
        //                 </span>
        //                 <button aria-label="Next trending items" className="text-gray-400 hover:text-teal-600">
        //                     <i className="fas fa-chevron-right">
        //                     </i>
        //                 </button>
        //             </div>
        //             <div className="space-y-3">
        //                 <article className="flex items-center gap-3 p-3 border border-gray-100 rounded-md shadow-sm ring-2 ring-teal-600 transition duration-300 hover:shadow-md hover:ring-teal-700 hover:scale-[1.01]">
        //                     <img alt="Healthy Nutmix, 200g Pack product image with dried fruit" className="w-[70px] h-[61.25px] object-contain rounded-sm" height="61" src="https://storage.googleapis.com/a1aa/image/e8a3f4e1-d310-4b54-b609-db8a5ac41d38.jpg" width="70" />
        //                     <div className="flex flex-col text-xs text-gray-500">
        //                         <span className="truncate max-w-[120px] font-normal text-gray-700">
        //                             Healthy Nutmix, 200g Pack
        //                         </span>
        //                         <span>
        //                             Driedfruit
        //                         </span>
        //                         <span className="font-bold text-gray-900">
        //                             $45.00
        //                             <span className="line-through font-normal text-gray-400">
        //                                 $49.00
        //                             </span>
        //                         </span>
        //                     </div>
        //                 </article>
        //                 <article className="flex items-center gap-3 p-3 border border-gray-100 rounded-md shadow-sm ring-2 ring-teal-600 transition duration-300 hover:shadow-md hover:ring-teal-700 hover:scale-[1.01]">
        //                     <img alt="Organic Fresh Tomato product image with vegetables" className="w-[70px] h-[61.25px] object-contain rounded-sm" height="61" src="https://storage.googleapis.com/a1aa/image/2de7f38e-e461-4fe2-8134-2066891f41a9.jpg" width="70" />
        //                     <div className="flex flex-col text-xs text-gray-500">
        //                         <span className="truncate max-w-[120px] font-normal text-gray-700">
        //                             Organic Fresh Tomato
        //                         </span>
        //                         <span>
        //                             Vegetables
        //                         </span>
        //                         <span className="font-bold text-gray-900">
        //                             $30.00
        //                             <span className="line-through font-normal text-gray-400">
        //                                 $25.00
        //                             </span>
        //                         </span>
        //                     </div>
        //                 </article>
        //                 <article className="flex items-center gap-3 p-3 border border-gray-100 rounded-md shadow-sm ring-2 ring-teal-600 transition duration-300 hover:shadow-md hover:ring-teal-700 hover:scale-[1.01]">
        //                     <img alt="Coffee With Chocolate Cream Mix product image with coffee" className="w-[70px] h-[61.25px] object-contain rounded-sm" height="61" src="https://storage.googleapis.com/a1aa/image/35a8b65f-66ad-4b1d-fe9a-385a43523eff.jpg" width="70" />
        //                     <div className="flex flex-col text-xs text-gray-500">
        //                         <span className="truncate max-w-[120px] font-normal text-gray-700">
        //                             Coffee With Chocolate Cream Mix
        //                         </span>
        //                         <span>
        //                             Coffee
        //                         </span>
        //                         <span className="font-bold text-gray-900">
        //                             $65.00
        //                             <span className="line-through font-normal text-gray-400">
        //                                 $62.00
        //                             </span>
        //                         </span>
        //                     </div>
        //                 </article>
        //             </div>
        //         </section>
        //         <section>
        //             <div className="flex items-center justify-center gap-1 mb-4 text-sm font-semibold text-gray-600">
        //                 <button aria-label="Previous top rated items" className="text-gray-400 hover:text-teal-600">
        //                     <i className="fas fa-chevron-left">
        //                     </i>
        //                 </button>
        //                 <span>
        //                     Top
        //                     <span className="text-teal-600">
        //                         Rated
        //                     </span>
        //                 </span>
        //                 <button aria-label="Next top rated items" className="text-gray-400 hover:text-teal-600">
        //                     <i className="fas fa-chevron-right">
        //                     </i>
        //                 </button>
        //             </div>
        //             <div className="space-y-3">
        //                 <article className="flex items-center gap-3 p-3 border border-gray-100 rounded-md shadow-sm ring-2 ring-teal-600 transition duration-300 hover:shadow-md hover:ring-teal-700 hover:scale-[1.01]">
        //                     <img alt="Ginger - Organic product image with vegetables" className="w-[70px] h-[61.25px] object-contain rounded-sm" height="61" src="https://storage.googleapis.com/a1aa/image/110beb46-c79d-4d01-3096-054aad06afa1.jpg" width="70" />
        //                     <div className="flex flex-col text-xs text-gray-500">
        //                         <span className="truncate max-w-[120px] font-normal text-gray-700">
        //                             Ginger - Organic
        //                         </span>
        //                         <span>
        //                             Vegetables
        //                         </span>
        //                         <span className="font-bold text-gray-900">
        //                             $65.00
        //                             <span className="line-through font-normal text-gray-400">
        //                                 $62.00
        //                             </span>
        //                         </span>
        //                     </div>
        //                 </article>
        //                 <article className="flex items-center gap-3 p-3 border border-gray-100 rounded-md shadow-sm ring-2 ring-teal-600 transition duration-300 hover:shadow-md hover:ring-teal-700 hover:scale-[1.01]">
        //                     <img alt="Dates Value Pouch product image with dried fruit" className="w-[70px] h-[61.25px] object-contain rounded-sm" height="61" src="https://storage.googleapis.com/a1aa/image/331b2834-6cfa-44bc-1676-df6024fe728c.jpg" width="70" />
        //                     <div className="flex flex-col text-xs text-gray-500">
        //                         <span className="truncate max-w-[120px] font-normal text-gray-700">
        //                             Dates Value Pouch Dates Value Pouch
        //                         </span>
        //                         <span>
        //                             Driedfruit
        //                         </span>
        //                         <span className="font-bold text-gray-900">
        //                             $78.00
        //                             <span className="line-through font-normal text-gray-400">
        //                                 $58.00
        //                             </span>
        //                         </span>
        //                     </div>
        //                 </article>
        //                 <article className="flex items-center gap-3 p-3 border border-gray-100 rounded-md shadow-sm ring-2 ring-teal-600 transition duration-300 hover:shadow-md hover:ring-teal-700 hover:scale-[1.01]">
        //                     <img alt="Blue Berry product image with fruits" className="w-[70px] h-[61.25px] object-contain rounded-sm" height="61" src="https://storage.googleapis.com/a1aa/image/6f745852-ddb7-4a6a-ff4b-659d15bd36ec.jpg" width="70" />
        //                     <div className="flex flex-col text-xs text-gray-500">
        //                         <span className="truncate max-w-[120px] font-normal text-gray-700">
        //                             Blue Berry
        //                         </span>
        //                         <span>
        //                             Fruits
        //                         </span>
        //                         <span className="font-bold text-gray-900">
        //                             $30.00
        //                             <span className="line-through font-normal text-gray-400">
        //                                 $28.00
        //                             </span>
        //                         </span>
        //                     </div>
        //                 </article>
        //             </div>
        //         </section>
        //         <section>
        //             <div className="flex items-center justify-center gap-1 mb-4 text-sm font-semibold text-gray-600">
        //                 <button aria-label="Previous top selling items" className="text-gray-400 hover:text-teal-600">
        //                     <i className="fas fa-chevron-left">
        //                     </i>
        //                 </button>
        //                 <span>
        //                     Top
        //                     <span className="text-teal-600">
        //                         Selling
        //                     </span>
        //                 </span>
        //                 <button aria-label="Next top selling items" className="text-gray-400 hover:text-teal-600">
        //                     <i className="fas fa-chevron-right">
        //                     </i>
        //                 </button>
        //             </div>
        //             <div className="space-y-3">
        //                 <article className="flex items-center gap-3 p-3 border border-gray-100 rounded-md shadow-sm ring-2 ring-teal-600 transition duration-300 hover:shadow-md hover:ring-teal-700 hover:scale-[1.01]">
        //                     <img alt="Lemon - Seedless product image with vegetables" className="w-[70px] h-[61.25px] object-contain rounded-sm" height="61" src="https://storage.googleapis.com/a1aa/image/2cc2e923-bcce-4c33-d184-5d6003336fd4.jpg" width="70" />
        //                     <div className="flex flex-col text-xs text-gray-500">
        //                         <span className="truncate max-w-[120px] font-normal text-gray-700">
        //                             Lemon - Seedless
        //                         </span>
        //                         <span>
        //                             Vegetables
        //                         </span>
        //                         <span className="font-bold text-gray-900">
        //                             $45.00
        //                             <span className="line-through font-normal text-gray-400">
        //                                 $49.00
        //                             </span>
        //                         </span>
        //                     </div>
        //                 </article>
        //                 <article className="flex items-center gap-3 p-3 border border-gray-100 rounded-md shadow-sm ring-2 ring-teal-600 transition duration-300 hover:shadow-md hover:ring-teal-700 hover:scale-[1.01]">
        //                     <img alt="Mango - Kesar product image with fruits" className="w-[70px] h-[61.25px] object-contain rounded-sm" height="61" src="https://storage.googleapis.com/a1aa/image/dae787c6-89e6-41c7-d8b1-889a0e9b2caf.jpg" width="70" />
        //                     <div className="flex flex-col text-xs text-gray-500">
        //                         <span className="truncate max-w-[120px] font-normal text-gray-700">
        //                             Mango - Kesar
        //                         </span>
        //                         <span>
        //                             Fruits
        //                         </span>
        //                         <span className="font-bold text-gray-900">
        //                             $65.00
        //                             <span className="line-through font-normal text-gray-400">
        //                                 $62.00
        //                             </span>
        //                         </span>
        //                     </div>
        //                 </article>
        //                 <article className="flex items-center gap-3 p-3 border border-gray-100 rounded-md shadow-sm ring-2 ring-teal-600 transition duration-300 hover:shadow-md hover:ring-teal-700 hover:scale-[1.01]">
        //                     <img alt="Mixed Nuts &amp; Almonds Dry Fruits product image with dried fruit" className="w-[70px] h-[61.25px] object-contain rounded-sm" height="61" src="https://storage.googleapis.com/a1aa/image/7be47eb3-5ed6-48ef-cf17-4ee95dae380d.jpg" width="70" />
        //                     <div className="flex flex-col text-xs text-gray-500">
        //                         <span className="truncate max-w-[120px] font-normal text-gray-700">
        //                             Mixed Nuts &amp; Almonds Dry Fruits
        //                         </span>
        //                         <span>
        //                             Driedfruit
        //                         </span>
        //                         <span className="font-bold text-gray-900">
        //                             $11.00
        //                             <span className="line-through font-normal text-gray-400">
        //                                 $10.00
        //                             </span>
        //                         </span>
        //                     </div>
        //                 </article>
        //             </div>
        //         </section>
        //     </div>
        // </div>
  <div>
    
  </div>
    )
}

export default Trending