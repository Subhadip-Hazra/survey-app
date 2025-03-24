import { ReactNode } from "react";

const SurveyLayout = async ({ children }: { children: ReactNode }) => {
    return <div className="root-layout p-4">{children}</div>;
};

export default SurveyLayout;