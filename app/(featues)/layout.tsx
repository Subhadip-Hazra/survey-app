import { ReactNode } from "react";

const PageLayout = async ({ children }: { children: ReactNode }) => {
    return <div className="root-layout p-4">{children}</div>;
};

export default PageLayout;