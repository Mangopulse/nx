import { CSSProperties } from "react";

export const containerStyle:CSSProperties = {
    boxSizing: "border-box",
    minWidth: "600px",
    width: "600px",
    maxWidth: "600px",
    backgroundColor: "white",
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingLeft: '20px',
    paddingRight: '20px',
    borderRadius: '8px',
    border: '1px solid #0002',
    borderCollapse: 'separate',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
};

export const headingStyle:CSSProperties = {
    fontSize: "30px",
    fontWeight: "bold",
    textAlign: "center" as const,
    marginBottom: "0px",
    marginTop: "0px",
};
export const descriptionStyle:CSSProperties = {
    fontSize: "16px",
    textAlign: "center" as const,
    margin: "0px",
};

export const articleTitle:CSSProperties = {
    fontSize: "19px",
    fontWeight: "bold",
    margin: '0 20px 10px 20px',
    lineHeight: '2rem',
};

export const readMore:CSSProperties = {
    fontSize: "14px",
    margin: '0 20px',
    padding: '8px 14px',
    borderRadius: '5px',
    backgroundColor: '#0d1349',
    color: '#fff',
    width: 'fit-content'
}

