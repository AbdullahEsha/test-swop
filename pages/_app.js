import "../styles/globals.css";
import "../styles/buy.css";
import "../styles/payment.css";
import { Provider } from "react-redux";
import { wrapper } from "../store/store";
import { productsActions } from "../store/productSlice";
import axios from "axios";
import { URL } from "../components/Reuses/URL";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import TagManager from "react-gtm-module";

// _app.js file

export default function App({ Component, ...rest }) {
  const router = useRouter();

  useEffect(() => {
    document.title = `Swop - ${
      router.pathname.split("/")[1] != ""
        ? router.pathname
            .split("/")[1]
            .toLowerCase()
            .replace(/\b[a-z]/g, function (e) {
              return e.toUpperCase();
            })
        : "Home"
    }`;
    TagManager.initialize({ gtmId: "GTM-K4F3KTP" });
  }, [router]);

  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Layout>
        <Component {...props.pageProps} />
      </Layout>
    </Provider>
  );
}

App.getInitialProps = wrapper.getInitialAppProps(
  ({ dispatch }) =>
    async ({ Component, ctx }) => {
      // const data = { id: 1, name: "demo" };
      // const res = await axios.get(`https://api.spacexdata.com/v3/launches`);
      // const data = res.data;
      // dispatch(setUser(data));

      const res2 = await axios.get(`${URL}/api/v1/product/all`);
      const data2 = res2.data;

      dispatch(productsActions.storeProducts(data2));

      if (!ctx.req) {
        return {
          pageProps: {
            ...(Component.getInitialProps
              ? (await Component.getInitialProps(ctx))?.initialProps ||
                (await Component.getInitialProps(ctx))
              : {}),
            pathname: ctx.pathname,
          },
        };
      }

      try {
        return {
          pageProps: {
            ...(Component.getInitialProps
              ? (await Component.getInitialProps(ctx)).initialProps ||
                (await Component.getInitialProps(ctx))
              : {}),
            pathname: ctx.pathname,
          },
        };
      } catch (error) {
        if (ctx.res) {
          // server
          ctx.res.writeHead(302, {
            Location: "/404",
          });
          ctx.res.end();
        } else {
          // client
          // Router.push('/404');
        }
        return;
        // ctx.res.statusCode = 404;
        // ctx.res.end("Not found");
        // return;
      }
    }
);
