import React from "react";
import "./result.css";
import { useSelector } from "react-redux";

function Result() {
  const analysisResult = useSelector((state) => state.analysis.result);
  const result = analysisResult?.result || "";
  const atsScore = analysisResult?.atsScore || 0;
  const length = result.length;

  // const {result, atsScore} = useSelector((state) => state.analysis.result);

  return (
    <div className="">
      {length > 0 ? (
        <div className="mt-4 lg:h-28 rounded-lg bg-sky-900 flex flex-col items-start p-4  ">
          <h1 className="text-2xl lg:text-4xl lg:font-bold px-3 text-white font-mono ">
            You're almost there...&#127881; &#127882;
          </h1>
          <p className="text-sm font-mono mt-3 px-3 text-white">
            We'll analyze your resume and provide valuable feedback to help you
            improve
          </p>
        </div>
      ) : null}
      <div className="flex">
        <div className="w-1/2 ml-4 p-5 mt-4 text-center border-2 border-purple-300 rounded-2xl">
          {length === 0 ? (
            <h4 className="text-2xl font-bold">Please upload your resume</h4>
          ) : (
            <>
              <h3 className="text-2xl font-semibold">Analysis Result:</h3>
              <p className="text-xl tracking-wide font-serif text-gray-900 whitespace-pre-line">
                {result}
              </p>
              <h3 className="text-green-500 text-2xl font-bold">
                Ats Score: {atsScore}/100
              </h3>
            </>
          )}
        </div>
        <div className="w-1/2 ml-4 p-5 mt-4 text-center border-2 border-purple-300 rounded-2xl">
          {atsScore >= 80 ? (
            <p className="text-2xl font-bold text-green-500 mt-2">
              "Congratulations! Your resume stands out and has a high chance of success!"
            </p>
          ) : atsScore >= 60 ? (
            <p className="text-xl font-bold text-blue-500 mt-2">
              "Great job! Your resume is good but can be further optimized for better results."
            </p>
          ): null}
        </div>
      </div>
    </div>
  );
}

export default Result;
