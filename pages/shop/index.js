import Image from "next/image";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Product from "../../components/Reuses/Product";
import { useSelector } from "react-redux";

const Shop = () => {
  // here I want to use this data. i get the data but it's not server side rendered

  const Products = useSelector((state) => state?.products.allProducts) || {};

  // console.log(Products);
  // if (error) return <div>Something is wrong</div>;
  return (
    <>
      <Navbar />
      <div className="container-x home-top-margin">
        <div className="shop-top-content">
          <div className="shop-product-ads">
            <div className="row-div">
              <div className="col-6">
                <div className="shop-product-ads-img">
                  <Image src={"/shopPage.png"} width={450} height={450} />
                </div>
              </div>
              <div className="col-6">
                <div className="shop-product-content">
                  <div className="shop-product-content-inside">
                    <h4>SWOP Wrist Band</h4>
                    <p>Available Now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="justify-grid">
            {Products &&
              Products.data.map((item, index) => (
                <Product key={index} item={item} />
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Dynamic
// export async function getStaticProps() {
//   try {
//     const res = await axios.get(`${URL}/api/v1/products`);
//     const data = res.data;

//     return {
//       props: {
//         data,
//         error: null,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         data: [],
//         error: {
//           message: error.message,
//         },
//       },
//     };
//   }
// }

export default Shop;
