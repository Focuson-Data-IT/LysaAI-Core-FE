import React from "react";
import moment from "moment";
import OurDatePicker from "@/components/OurDatePicker";
import OurSelect from "@/components/OurSelect";

const FairScoreFilters: React.FC<{
    period: any;
    setPeriod: any;
    setParentPeriod: any;
    selectedOptions: any;
    setSelectedOptions: any;
    permaOptions: any;
    setPermaOptions: any;
    setParentSelectedOption: any;
}> = ({ period, setPeriod, setParentPeriod, selectedOptions, setSelectedOptions, permaOptions }) => {
    return (
        <div className="mb-2 flex items-center justify-between gap-5 p-3">
            <div>
                <span className="text-sm font-medium text-bgray-600 dark:text-white">FAIR Score</span>
                <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-bgray-900 dark:text-white sm:text-2xl">
                        {moment(period.startDate).format("DD MMM YYYY")} - {moment(period.endDate).format("DD MMM YYYY")}
                    </h3>
                </div>
            </div>
            <div className="date-filter flex gap-5">
                <OurDatePicker
                    applyCallback={(v) => {
                        setPeriod({ startDate: v[0], endDate: v[1] });
                        setParentPeriod({ startDate: v[0], endDate: v[1] });
                    }}
                />
                <OurSelect permaOptions={permaOptions} options={selectedOptions} disabled={false} setParentSelectedOption={setSelectedOptions} />
            </div>
        </div>
    );
};

export default FairScoreFilters;
