/**
 * This file was generated from Matrix.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ListValue, ListAttributeValue } from "mendix";

export interface MatrixContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    nodes?: ListValue;
    nodeID?: ListAttributeValue<string>;
    links?: ListValue;
    linkSourceID?: ListAttributeValue<string>;
    linkTargetID?: ListAttributeValue<string>;
}

export interface MatrixPreviewProps {
    class: string;
    style: string;
    nodes: {} | null;
    nodeID: string;
    links: {} | null;
    linkSourceID: string;
    linkTargetID: string;
}
