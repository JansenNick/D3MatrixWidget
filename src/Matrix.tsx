import { Component, ReactNode, createElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";

import { MatrixContainerProps } from "../typings/MatrixProps";

import "./ui/Matrix.css";

export default class Matrix extends Component<MatrixContainerProps> {
    render(): ReactNode {
        return <HelloWorldSample sampleText={this.props.sampleText ? this.props.sampleText : "World"} />;
    }
}
