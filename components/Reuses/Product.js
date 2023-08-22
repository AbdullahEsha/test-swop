import Link from 'next/link';
import React from 'react';
import { replaceWhitespaceWithHyphen, truncateString } from './Reuse';
import parse from 'html-react-parser';
import Image from 'next/image';

const Product = ({ item }) => {
  return (
    <div className="product-card">
      <div className="center" style={{ height: '60%' }}>
        <Link
          href={`/shop/${item.type === 'regular' ? '' : 'custom/'}${
            item.slug
          }`}
          key={item._id}
        >
          <Image
            height={250}
            width={250}
            src={item.imageUrls[0]}
            alt={item.name}
          />
        </Link>
      </div>
      <h5 className="text-center">{item.name}</h5>
      <div className="product-card-description">
        {parse(item.description)}
      </div>
      <div className="product-price">
        <label>${item.price.$numberDecimal}</label>
        <Link
          href={`/shop/${item.type === 'regular' ? '' : 'custom/'}${
            item.slug
          }`}
        >
          Buy
        </Link>
      </div>
    </div>
  );
};

export default Product;
