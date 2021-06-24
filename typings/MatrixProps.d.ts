/**
 * This file was generated from Matrix.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { EditableValue, ListValue, ListAttributeValue } from "mendix";

export interface MatrixContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    nodes?: ListValue;
    nodeID?: ListAttributeValue<string>;
    nodeLabel?: ListAttributeValue<string>;
    nodeGroup?: ListAttributeValue<string>;
    links?: ListValue;
    linkSourceID?: ListAttributeValue<string>;
    linkTargetID?: ListAttributeValue<string>;
    sortAlgorithm: EditableValue<string>;
}

export interface MatrixPreviewProps {
    class: string;
    style: string;
    nodes: {} | null;
    nodeID: string;
    nodeLabel: string;
    nodeGroup: string;
    links: {} | null;
    linkSourceID: string;
    linkTargetID: string;
    sortAlgorithm: string;
}
