import { Component, ReactNode, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { MatrixPreviewProps } from "../typings/MatrixProps";

declare function require(name: string): string;

export class preview extends Component<MatrixPreviewProps> {
    render(): ReactNode {
        return <HelloWorldSample sampleText={this.props.sampleText} />;
    }
}

export function getPreviewCss(): string {
    return require("./ui/Matrix.css");
}
