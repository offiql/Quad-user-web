import React from "react";

const InsurranceDetails = () => {
  return (
    <div>
      <div className="">
        <div className="mt-6 bg-[#F8EFFF] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Insurance Policy : Health Cover
            </h3>
            <div className="text-sm text-muted-foreground">
              <p>Valid Till : 27/10/2025</p>
              <p>Next Due : 27 November 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurranceDetails;
