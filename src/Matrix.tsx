import { Component, ReactNode, createElement } from "react";
import MatrixComp from "./components/MatrixComp";

import { MatrixContainerProps } from "../typings/MatrixProps";

import "./ui/Matrix.css";

export default class Matrix extends Component<MatrixContainerProps> {
    render(): ReactNode {
        return (
            <MatrixComp
                nodes={this.props.nodes}
                nodeID={this.props.nodeID}
                nodeLabel={this.props.nodeLabel}
                nodeGroup={this.props.nodeGroup}
                links={this.props.links}
                linkSourceID={this.props.linkSourceID}
                linkTargetID={this.props.linkTargetID}
                sortAlgorithm={this.props.sortAlgorithm}
                className={this.props.class}
                style={this.props.style}
                width={this.props.width}
                height={this.props.height}
                marginLeft={this.props.marginLeft}
                marginRight={this.props.marginRight}
                marginTop={this.props.marginTop}
                marginBottom={this.props.marginBottom}
                animation={this.props.animation}
            />
        );
    }
}
