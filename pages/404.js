import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.back(), 4000);
  }, []);

  return (
    <div className="loading-page">
      <div className="page-404">
        <h1>
          404 Error!
          <br />
          Sorry, Page not found. 😢
        </h1>
        <p>Page you are requested for, is corrently unavailable.</p>
        <button onClick={() => router.back()}>Back</button>
      </div>
    </div>
  );
};

export default NotFound;
