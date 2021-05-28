import { Component, ReactNode, createElement } from "react";
import MatrixComp from "./components/MatrixComp";

import { MatrixContainerProps } from "../typings/MatrixProps";

import "./ui/Matrix.css";

export default class Matrix extends Component<MatrixContainerProps> {
    render(): ReactNode {
        // if (this.props.nodes.status === 'available' &&
        //     this.props.links.status === 'available') {
        return (
            <MatrixComp
                nodes={this.props.nodes}
                nodeID={this.props.nodeID}
                nodeLabel={this.props.nodeLabel}
                links={this.props.links}
                linkSourceID={this.props.linkSourceID}
                linkTargetID={this.props.linkTargetID}
                sortAlgorithm={this.props.sortAlgorithm}
            />
        );
        // }
    }
}
