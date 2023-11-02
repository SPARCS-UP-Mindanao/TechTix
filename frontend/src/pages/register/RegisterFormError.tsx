import sparcsLogo from "@/assets/sparcsLogo.svg";

const Error404 = () => {
    return (
      <>
        <div className="flex flex-col items-center h-screen">
            <img style={{ aspectRatio: 4 / 3 }} src={sparcsLogo} className="pt-11 pb-32" />
            <div className="text-8xl font-subjectivity font-bold text-transparent bg-gradient-to-br bg-clip-text from-secondary-pink-400 to-primary-500">404</div>
            <h2 className="text-xl text-primary font-raleway font-bold">Page not found</h2>
        </div>
      </>
    );
  };
  
  export default Error404;  