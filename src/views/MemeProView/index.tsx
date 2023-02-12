import { FC, useEffect, useRef, useState, Fragment, PureComponent } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

import { MainMenu } from "../mainmenu"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Metaplex, bundlrStorage, walletAdapterIdentity, MetaplexFileTag, toMetaplexFileFromBrowser, MetaplexFile } from "@metaplex-foundation/js"
import { PublicKey } from "@solana/web3.js"
import html2canvas from 'html2canvas'
import downloadjs from 'downloadjs'

import classNames from "classnames";
import { ref } from "framework-utils";
import { Frame, setAlias } from "scenejs";

import ReactDragSelectable from "./full-drag-select";
import MoveAble, { OnRotateStart } from "react-moveable";
import Guides from "./guides";
import {
  MoveableManagerProps,
  OnDrag,
  OnDragGroupEnd,
  OnDragGroupStart,
  OnDragStart,
  OnResize,
  OnResizeGroup,
  OnResizeGroupStart,
  OnResizeStart,
  OnRotate,
  OnRotateGroup,
  OnRotateGroupEnd,
  OnRotateGroupStart,
  OnRender,
  OnRenderGroup,
  OnClick,
  OnClickGroup
} from "react-moveable";

import { Targets } from "./type";
import BaseElement from "./elements/base-elements";

setAlias("tx", ["transform", "translateX"]);
setAlias("ty", ["transform", "translateY"]);
setAlias("tz", ["transform", "translateZ"]);
setAlias("rotate", ["transform", "rotate"]);
setAlias("sx", ["transform", "scaleX"]);
setAlias("sy", ["transform", "scaleY"]);
setAlias("matrix3d", ["transform", "matrix3d"]);

const Elements: JSX.Element[] = [];


export const MemeProView: FC = ({ }) => {
  const [elements, setElements] = useState<JSX.Element[]>([]);
  type ArtBoardProps = {
    /** Desktop, tablet or mobile view */
    viewMode: string;
    background: string;

    /** Should trigger when target length is changed, we need to notify target count changed*/
    onTargetCountChange?: (count: number) => void;
    onArtBoardDoubleClick?: Function;
  };

  type TranslateType = number[];

  type ArtBoardState = {
    isLoading?: boolean;
    hasElementResizing?: boolean;
    frame: {
      translate: TranslateType;
      rotate: number;
    };
    target?: any;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    rKey?: boolean;
    verticalGuidelines?: number[];
    horizontalGuidelines?: number[];
    showRuler?: boolean;
    selectables: {
      [id: string]: HTMLElement | SVGAElement | null;
    };
    visibleElements?: Array<HTMLElement | SVGAElement>;
    lastSelectElement: {
      time?: number;
      element?: HTMLElement | SVGAElement | undefined | null;
    };
  };


  class ArtBoard extends PureComponent<
    ArtBoardProps,
    ArtBoardState
  > {
    static defaultProps: ArtBoardProps = {
      viewMode: "desktop",
      background: './gen2_layer/bg/blue.png'
    };

    state: ArtBoardState = {
      isLoading: true,
      hasElementResizing: false,
      frame: {
        translate: [0, 0, 0],
        rotate: 0
      },
      showRuler: false,
      selectables: {},
      lastSelectElement: {
        time: 0,
        element: null
      }
    };

    /** MoveAble tooltip */
    private tooltip: HTMLElement | undefined;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    callback: Function = (selection: any, event: any) => { };
    private moveable!: MoveableManagerProps<any>
    private frameMap = new Map();

    private guides1: Guides | null = null;
    private guides2: Guides | null = null;
    private handleRenderGroup: any = ({ targets }: OnRenderGroup) => {
      targets.forEach(target => this.handleRender({ target }));
    };

    /**
     * Create new frame and assign it to frameMap*/
    newFrame = (el: HTMLElement | SVGAElement) => {
      const frame = new Frame({
        transform: {
          translateX: "0px",
          translateY: "0px",
          rotate: "0deg",
          scaleX: 1,
          scaleY: 1
        }
      });

      this.frameMap.set(el, frame);

      return frame;
    };

    getFrame = (target: HTMLElement | SVGAElement) => {
      return this.frameMap.get(target) || this.newFrame(target);
    };

    private handleRender: any = ({ target }: OnRender) => {
      // const {frame} = this.state;
      // target.style.transform = `translate(${frame.translate[0]}px, ${
      //     frame.translate[1]
      // }px) rotate(${frame.rotate}deg)`;

      target.style.cssText += this.getFrame(target as
        | HTMLElement
        | SVGAElement).toCSS();
    };

    private dragSelector: any;
    private handleDragSelectRef: any = (r: any) => {
      this.dragSelector = r;
    };

    private handleChildMounted: any = (
      id: string,
      element: HTMLElement | SVGAElement | null
    ) => {
      if (!this.state.selectables[id]) {
        setTimeout(() => {
          this.setState({
            selectables: {
              ...this.state.selectables,
              [id]: element
            }
          });
        });
      }
    };
    private handleChildUnmounted: any = (
      id: string,
      element: HTMLElement | SVGAElement | null
    ) => { };
    private handleVisibleElementsChange: any = (
      visibleElements: Array<HTMLElement | SVGAElement>
    ) => {
      console.log("doiniit----2")
      this.setState({ visibleElements });
    };

    UNSAFE_componentWillMount(): void {
      this.fakeLoadingTimeout = setTimeout(() => {
        this.setState({ isLoading: false });
        clearTimeout(this.fakeLoadingTimeout);
      }, 0);
    }

    componentDidMount(): void {
      this.tooltip = this.createTooltip();

      // setup guides
      window.addEventListener("resize", () => {
        if (this.guides1) {
          this.guides1.resize();
        }

        if (this.guides2) {
          this.guides2.resize();
        }
      });
    }

    fakeLoadingTimeout?: any;

    handleSelectChange = (
      newTarget?: HTMLElement | SVGAElement | undefined | null,
      event?: MouseEvent
    ) => {
      if (
        this.state.lastSelectElement &&
        this.state.lastSelectElement.element === newTarget &&
        this.state.lastSelectElement.time &&
        new Date().getTime() - this.state.lastSelectElement.time < 250
      ) {
        if (typeof this.props.onArtBoardDoubleClick === "function") {
          this.props.onArtBoardDoubleClick();
        }
      } else {
        this.setState({
          lastSelectElement: {
            time: new Date().getTime(),
            element: newTarget
          }
        });
      }
      let nextState: Targets = this.state.target || [];
      if (newTarget) {
        const index = nextState.indexOf(newTarget);
        if (index === -1) {
          if (this.state.ctrlKey) {
            nextState = [...nextState, newTarget];
          } else {
            nextState = [newTarget];
          }
        } else if (this.state.ctrlKey) {
          nextState.splice(index, 1);
          nextState = nextState.slice();
        }
      } else {
        nextState = [];
      }

      this.onTargetChange(nextState, () => {
        this.moveable.dragStart(event);
        if (this.state.target[0] === newTarget) {
          this.moveable.updateRect();
        }
      });
    };

    handleMultipleSelectChange = (
      elements: Array<HTMLElement | SVGAElement>,
      event: MouseEvent
    ) => {
      this.onTargetChange(elements, () => {
        // this.moveable.dragStart(event);
        // this.moveable.updateRect();
      });
    };

    private onTargetChange: any = (newTarget: any, callback?: Function) => {
      this.setState(
        {
          target: newTarget
        },
        () => {
          if (typeof callback === "function") {
            callback();
          }

          if (typeof this.props.onTargetCountChange === "function") {
            this.props.onTargetCountChange(
              this.state.target ? this.state.target.length : 0
            );
          }
        }
      );
    };

    private handleElementClick: any = () => { };

    private handleGroupClick: any = ({
      inputEvent,
      inputTarget,
      targets,
      target,
      isTarget,
      targetIndex
    }: OnClickGroup) => {
      if (!inputTarget.classList.contains("element__wrapper")) {
        return;
      }

      const index = targets.indexOf(inputTarget);
      let nextTargets = targets.slice();

      if (this.state.ctrlKey) {
        if (index === -1) {
          nextTargets = nextTargets.concat(inputTarget);
        } else {
          nextTargets.splice(index, 1);
        }
      } else {
        nextTargets = [inputTarget];
      }

      this.onTargetChange(nextTargets, () => {
        this.moveable.updateRect();
      });

      // this.setState({
      //     target: nextTargets,
      // }, () => {
      //     this.moveable.updateRect();
      // });
    };
    private handleDragGroupStart: any = ({ events }: OnDragGroupStart) => {
      this.lockSelector();

      events.forEach(this.handleDragStart);
    };
    private handleDragGroup: any = ({ events }: OnDragGroupStart) => {
      events.forEach(this.handleDrag);
    };
    private handleDragGroupEnd: any = ({
      targets,
      isDrag,
      clientX,
      clientY
    }: OnDragGroupEnd) => {
      this.unLockSelector();
      this.hideTooltip();
    };
    private handleResizeGroupStart: any = ({
      targets,
      events
    }: OnResizeGroupStart) => {
      this.lockSelector();
      events.forEach(this.handleResizeStart);
    };
    private handleResizeGroup: any = ({ targets, events }: OnResizeGroup) => {
      events.forEach(this.handleResize);
    };
    private handleResizeGroupEnd: any = () => {
      this.unLockSelector();
      this.hideTooltip();
    };

    handleArtBoardRef = (r: HTMLDivElement) => {
      this.artBoard = r;
    };
    artBoard: HTMLElement | null = null;

    createTooltip = () => {
      const tooltip = document.createElement("div");

      tooltip.id = "lf-m-tooltip";
      tooltip.className = "lf__tooltip";
      tooltip.style.display = "none";
      const area = this.artBoard;
      if (area) {
        area.appendChild(tooltip);
      }

      return tooltip;
    };

    setTooltipContent = (clientX: number, clientY: number, text: string) => {
      if (this.tooltip) {
        this.tooltip.style.cssText = `display: block; transform: translate(${clientX +
          50}px, ${clientY - 10}px) translate(-100%, -100%);`;
        this.tooltip.innerHTML = text;
      }
    };

    hideTooltip = () => {
      if (this.tooltip) {
        this.tooltip.style.display = "none";
      }
    };

    lockSelector = () => {
      this.setState({ hasElementResizing: true });
    };

    unLockSelector = () => {
      this.setState({ hasElementResizing: false });
    };

    private handleDragStart: any = ({ target, set }: OnDragStart) => {
      this.lockSelector();
      const frame = this.getFrame(target as HTMLElement | SVGAElement);
      set([
        parseFloat(frame.get("transform", "translateX")),
        parseFloat(frame.get("transform", "translateY"))
      ]);
    };

    private handleDrag: any = ({
      target,
      beforeTranslate,
      translate,
      delta,
      left,
      top,
      clientX,
      clientY,
      isPinch
    }: OnDrag) => {
      const frame = this.getFrame(target as HTMLElement | SVGAElement);
      if (this.state.shiftKey) {
        if (delta[0] !== 0) {
          frame.set("transform", "translateX", `${beforeTranslate[0]}px`);
        } else if (delta[1] !== 0) {
          frame.set("transform", "translateY", `${beforeTranslate[1]}px`);
        }
      } else {
        frame.set("transform", "translateX", `${beforeTranslate[0]}px`);
        frame.set("transform", "translateY", `${beforeTranslate[1]}px`);
      }

      if (!isPinch) {
        this.setTooltipContent(
          clientX,
          clientY,
          `X: ${Math.round(left)}px<br/>Y: ${Math.round(top)}px`
        );
      }
    };

    private handleDragEnd: any = () => {
      this.unLockSelector();
      this.hideTooltip();
    };

    private handleResizeStart: any = ({
      target,
      setOrigin,
      dragStart
    }: OnResizeStart) => {
      this.lockSelector();
      setOrigin(["%", "%"]);
      const frame = this.getFrame(target as HTMLElement | SVGAElement);
      if (dragStart) {
        dragStart.set([parseFloat(frame.get("tx")), parseFloat(frame.get("ty"))]);
      }
    };

    private handleResize: any = ({
      target,
      width,
      height,
      drag,
      clientX,
      clientY,
      isPinch
    }: OnResize) => {
      const frame = this.getFrame(target as HTMLElement | SVGAElement);
      frame.set("width", `${width}px`);
      frame.set("height", `${height}px`);
      frame.set("tx", `${drag.beforeTranslate[0]}px`);
      frame.set("ty", `${drag.beforeTranslate[1]}px`);

      // target.style.cssText += frame.toCSS();

      if (!isPinch) {
        this.setTooltipContent(
          clientX,
          clientY,
          `W: ${width.toFixed(0)}px<br/>H: ${height.toFixed(0)}px`
        );
      }
    };

    private handleResizeEnd: any = () => {
      this.unLockSelector();
      this.hideTooltip();
    };

    private handleRotateStart: any = ({ target, set }: OnRotateStart) => {
      this.lockSelector();

      const frame = this.getFrame(target as HTMLElement | SVGAElement);
      set(parseFloat(frame.get("transform", "rotate")));
    };

    private handleRotate: any = ({
      target,
      beforeRotate,
      clientX,
      clientY,
      isPinch,
      beforeDelta
    }: OnRotate) => {
      // const deg = parseFloat(this.state.frame.rotate) + beforeDelta;
      // if (!isPinch) {
      //     this.setTooltipContent(clientX, clientY, `R: ${deg.toFixed(1)}`);
      // }

      const frame = this.getFrame(target as HTMLElement | SVGAElement);
      const deg = parseFloat(frame.get("transform", "rotate")) + beforeDelta;
      frame.set("transform", "rotate", `${deg}deg`);
      target.style.cssText += frame.toCSS();
      this.moveable.updateRect();
    };

    private handleRotateEnd: any = () => {
      this.unLockSelector();
      this.hideTooltip();
    };

    private handleRotateGroupStart: any = ({
      targets,
      events
    }: OnRotateGroupStart) => {
      this.lockSelector();
      events.forEach(({ target, set, dragStart }) => {
        const frame = this.getFrame(target as HTMLElement | SVGAElement);
        const tx = parseFloat(frame.get("transform", "translateX")) || 0;
        const ty = parseFloat(frame.get("transform", "translateY")) || 0;
        const rotate = parseFloat(frame.get("transform", "rotate")) || 0;

        set(rotate);

        if (dragStart) {
          dragStart.set([tx, ty]);
        }
      });

      // events.forEach(this.handleRotateStart);
    };
    private handleRotateGroup: any = ({
      targets,
      events,
      set
    }: OnRotateGroup) => {
      // events.forEach(this.handleRotate);
      events.forEach(({ target, beforeRotate, drag }) => {
        const frame = this.getFrame(target as HTMLElement | SVGAElement);
        const beforeTranslate = drag.beforeTranslate;

        frame.set("transform", "rotate", `${beforeRotate}deg`);
        frame.set("transform", "translateX", `${beforeTranslate[0]}px`);
        frame.set("transform", "translateY", `${beforeTranslate[1]}px`);
        target.style.cssText += frame.toCSS();
      });
    };
    private handleRotateGroupEnd: any = ({
      targets,
      isDrag
    }: OnRotateGroupEnd) => {
      this.unLockSelector();
    };

    public setAlignment(alignment: string) {
      const { target } = this.state;

      if (target && target.length > 0) {
        const baseElement: HTMLElement | SVGAElement = target[0];
        if (target.length > 1) {
          // alignment to selection
          if (baseElement) {
            const baseElementRect = baseElement.getBoundingClientRect();
            if (baseElementRect) {
              for (let i = 1; i < target.length; i++) {
                const currentRect = target[i].getBoundingClientRect();
                const frame = this.getFrame(target[i]);
                if (frame) {
                  // old transform
                  const oldTransformX = parseFloat(
                    frame.get("transform", "translateX")
                  );
                  const oldTransformY = parseFloat(
                    frame.get("transform", "translateY")
                  );
                  let translateX = 0;
                  let translateY = 0;
                  if (alignment === "left") {
                    translateX = baseElementRect.x - currentRect.x;
                  } else if (alignment === "center") {
                    translateX =
                      baseElementRect.x +
                      baseElementRect.width / 2 -
                      (currentRect.x + currentRect.width / 2);
                  } else if (alignment === "right") {
                    translateX =
                      baseElementRect.x -
                      currentRect.x +
                      (baseElementRect.width - currentRect.width);
                  } else if (alignment === "top") {
                    translateY = baseElementRect.y - currentRect.y;
                  } else if (alignment === "middle") {
                    translateY =
                      baseElementRect.y +
                      baseElementRect.height / 2 -
                      (currentRect.y + currentRect.height / 2);
                  } else if (alignment === "bottom") {
                    translateY =
                      baseElementRect.y +
                      baseElementRect.height -
                      currentRect.y -
                      currentRect.height;
                  }

                  if (translateX !== 0) {
                    frame.set(
                      "transform",
                      "translateX",
                      `${oldTransformX + translateX}px`
                    );
                  }

                  if (translateY !== 0) {
                    frame.set(
                      "transform",
                      "translateY",
                      `${oldTransformY + translateY}px`
                    );
                  }

                  // update target css
                  target[i].style.cssText += frame.toCSS();
                  this.moveable.updateRect();
                }
              }
            }
          }
        } else if (target.length === 1) {
          // alignment to art board
          alert("should align to art board");
        }
      }
    }

    private distributeElements = (
      elements: (HTMLElement | SVGAElement)[],
      distribution: string
    ) => {
      if (elements && elements.length > 0) {
        if (elements.length > 2) {
          let firstElement: HTMLElement | SVGAElement | null = null;
          let lastElement: HTMLElement | SVGAElement | null = null;
          if (distribution === "vertical") {
            // we need to sort elements by the y coordination of middle line
            elements.sort(
              (e1: HTMLElement | SVGAElement, e2: HTMLElement | SVGAElement) => {
                const e1Rect = e1.getBoundingClientRect();
                const e2Rect = e2.getBoundingClientRect();

                return e1Rect.y - e2Rect.y;
              }
            );

            firstElement = elements[0];
            const firstElementRect = firstElement.getBoundingClientRect();
            const firstElementMiddle =
              firstElementRect.y + firstElementRect.height / 2;
            lastElement = elements[elements.length - 1];
            const lastElementRect = lastElement.getBoundingClientRect();

            const totalElements = elements.length;
            const totalSpacing = Math.abs(
              firstElementRect.y -
              firstElementRect.height / 2 -
              (lastElementRect.y - lastElementRect.height / 2)
            );

            if (totalSpacing > 0) {
              const averageSpacing = totalSpacing / (totalElements - 1);
              for (let i = 1; i < totalElements - 1; i++) {
                // calculate distance from middle of this element to middle of first element
                const currentElementRect = elements[i].getBoundingClientRect();
                const oldDistance =
                  currentElementRect.y +
                  currentElementRect.height / 2 -
                  firstElementMiddle;

                const frame = this.getFrame(elements[i]);
                if (frame) {
                  // old transform
                  const oldTransformY = parseFloat(
                    frame.get("transform", "translateY")
                  );
                  frame.set(
                    "transform",
                    "translateY",
                    `${oldTransformY - (oldDistance - averageSpacing * i)}px`
                  );

                  // update target css
                  elements[i].style.cssText += frame.toCSS();
                }
              }
              this.moveable.updateRect();
            }
          } else if (distribution === "horizontal") {
            // we need to sort elements by the y coordination of middle line
            elements.sort(
              (e1: HTMLElement | SVGAElement, e2: HTMLElement | SVGAElement) => {
                const e1Rect = e1.getBoundingClientRect();
                const e2Rect = e2.getBoundingClientRect();

                return e1Rect.x - e2Rect.x;
              }
            );

            firstElement = elements[0];
            const firstElementRect = firstElement.getBoundingClientRect();
            const firstElementMiddle =
              firstElementRect.x + firstElementRect.width / 2;
            lastElement = elements[elements.length - 1];
            const lastElementRect = lastElement.getBoundingClientRect();

            const totalElements = elements.length;
            const totalSpacing = Math.abs(
              firstElementRect.x -
              firstElementRect.width / 2 -
              (lastElementRect.x - lastElementRect.width / 2)
            );

            if (totalSpacing > 0) {
              const averageSpacing = totalSpacing / (totalElements - 1);
              for (let i = 1; i < totalElements - 1; i++) {
                // calculate distance from middle of this element to middle of first element
                const currentElementRect = elements[i].getBoundingClientRect();
                const oldDistance =
                  currentElementRect.x +
                  currentElementRect.width / 2 -
                  firstElementMiddle;

                const frame = this.getFrame(elements[i]);
                if (frame) {
                  // old transform
                  const oldTransformX = parseFloat(
                    frame.get("transform", "translateX")
                  );
                  frame.set(
                    "transform",
                    "translateX",
                    `${oldTransformX - (oldDistance - averageSpacing * i)}px`
                  );

                  // update target css
                  elements[i].style.cssText += frame.toCSS();
                }
              }
              this.moveable.updateRect();
            }
          }
        }
      }
    };

    public setDistribution(distribution: string) {
      const { target } = this.state;

      return this.distributeElements(target, distribution);
    }

    renderMoveable = () => {
      const { horizontalGuidelines, verticalGuidelines } = this.state;

      return (
        <MoveAble
          ref={ref(this, "moveable")}
          // edge={true}
          target={this.state.target}
          draggable={true}
          snappable={true}
          snapCenter={true}
          throttleDrag={0}
          origin={false}
          resizable={true}
          throttleResize={0}
          rotatable={true}
          rotationAtCorner={false}
          scrollable={true}
          scrollContainer={document.documentElement}
          scrollThreshold={1}
          keepRatio={this.state.shiftKey}
          throttleRotate={this.state.shiftKey ? 30 : 0}
          onRender={this.handleRender}
          onRenderGroup={this.handleRenderGroup}
          elementGuidelines={this.state.visibleElements}
          verticalGuidelines={verticalGuidelines}
          horizontalGuidelines={horizontalGuidelines}
          onDragStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onDragEnd={this.handleDragEnd}
          onRotateStart={this.handleRotateStart}
          onRotate={this.handleRotate}
          onRotateEnd={this.handleRotateEnd}
          onResizeStart={this.handleResizeStart}
          onResize={this.handleResize}
          onResizeEnd={this.handleResizeEnd}
          onResizeGroupStart={this.handleResizeGroupStart}
          onResizeGroup={this.handleResizeGroup}
          onResizeGroupEnd={this.handleResizeGroupEnd}
          onClick={this.handleElementClick}
          onClickGroup={this.handleGroupClick}
          onDragGroupStart={this.handleDragGroupStart}
          onDragGroup={this.handleDragGroup}
          onDragGroupEnd={this.handleDragGroupEnd}
          onRotateGroupStart={this.handleRotateGroupStart}
          onRotateGroup={this.handleRotateGroup}
          onRotateGroupEnd={this.handleRotateGroupEnd}
        />
      );
    };

    renderGuides = () => {
      return (null);
    };

    renderLoading = () => {
      return <span className="align-middle">{"Initialising..."}</span>;
    };

    addObject = () => {
      const t = 0 + (Math.random() * 100 - 0)
      const l = 0 + (Math.random() * 100 - 0)
      Elements.push(
        <BaseElement
          key={`custom_element`}
          style={{
            top: t,
            left: l,
            padding: 10
          }}
          onMounted={this.handleChildMounted}
          onUnmounted={this.handleChildUnmounted}
        >
          <div>
            <img
              alt="test"
              src="./logo.png"
            />
          </div>
        </BaseElement>
      )
      console.log(Elements)
      setElements(Elements);
    }

    renderContent = () => {
      const { viewMode, background } = this.props;
      return (
        <div className={classNames("art_board_area", `art_board__${viewMode}`)}>
          <img
            alt="artboard_area"
            src={background}
          />
          {elements}
        </div>
      );
    };

    render() {
      const { isLoading, showRuler } = this.state;
      return (
        <Fragment>
          <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => this.addObject()}>addTest</button>
          <div
            ref={this.handleArtBoardRef}
            className={classNames("art_board_wrapper", {
              art_board__loading: isLoading,
              show__ruler: showRuler
            })}
          >
            {isLoading && this.renderLoading()}
            {!isLoading && this.renderContent()}
            {this.renderMoveable()}
          </div>
          {!isLoading && showRuler && this.renderGuides()}
          <ReactDragSelectable
            ref={this.handleDragSelectRef}
            container={this.artBoard}
            observerAbleClass="element__wrapper"
            selectAbleClass="element__selectable"
            onSelectChange={this.handleSelectChange}
            onMultipleSelectChange={this.handleMultipleSelectChange}
            locked={this.state.hasElementResizing}
            selectables={this.state.selectables}
            onVisibleElementsChange={this.handleVisibleElementsChange}
          />
        </Fragment>
      );
    }
  }

  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const wallet = useWallet();

  //MemeGenerator related
  const [theme, setTheme] = useState(1)
  const nextGen2Theme = async () => {
    if (theme < 3) {
      setTheme(theme + 1)
    }
    else {
      setTheme(1)
    }
  }
  const prevTheme = async () => {
    if (theme > 1) {
      setTheme(theme - 1)
    }
    else {
      setTheme(2)
    }
  }

  const setGen2Theme = async (v: number) => {
    setTheme(v)
  }

  const [page, setPage] = useState(1)
  const nextGen2Page = async () => {
    if (page < 8) {
      setPage(page + 1)
    }
    else {
      setPage(1)
    }
  }
  const prevGen2Page = async () => {
    if (page > 1) {
      setPage(page - 1)
    }
    else {
      setPage(8)
    }
  }

  const [rcpage, setRudeCansPage] = useState(1)
  const nextRudeCansPage = async () => {
    if (rcpage < 7) {
      setRudeCansPage(rcpage + 1)
    }
    else {
      setRudeCansPage(1)
    }
  }

  const prevRudeCansPage = async () => {
    if (rcpage > 1) {
      setRudeCansPage(rcpage - 1)
    }
    else {
      setRudeCansPage(7)
    }
  }

  const [textColor, setTextColor] = useState(1)
  const nextTextColor = async () => {
    if (textColor < 8) {
      setTextColor(textColor + 1)
    }
    else {
      setTextColor(1)
    }
  }

  //GEN2
  const bg1 = './gen2_layer/bg/blue.png';
  const bg2 = './gen2_layer/bg/grey.png';
  const bg3 = './gen2_layer/bg/invertedsolana.png';
  const bg4 = './gen2_layer/bg/pink.png';
  const bg5 = './gen2_layer/bg/red.png';
  const bg6 = './gen2_layer/bg/solana.png';
  const bg7 = './gen2_layer/bg/turqoise.png';
  const bg8 = './gen2_layer/bg/violet.png';
  const bg9 = './gen2_layer/bg/yellow.png';
  const bgs = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9]
  const [selectedGen2BG, setselectedGen2BG] = useState(bgs[8])
  const nextGen2BG = async () => {
    const currentIndex = bgs.indexOf(selectedGen2BG);
    const nextGen2Index = (currentIndex + 1) % bgs.length;
    setselectedGen2BG(bgs[nextGen2Index])
  }
  const prevGen2BG = async () => {
    const currentIndex = bgs.indexOf(selectedGen2BG);
    const nextGen2Index = (currentIndex - 1) % bgs.length;
    if (nextGen2Index < 0)
      setselectedGen2BG(bgs[bgs.length - 1])
    else
      setselectedGen2BG(bgs[nextGen2Index])
  }

  const body1 = './gen2_layer/body/bro.png';
  const body2 = './gen2_layer/body/ese.png';
  const body3 = './gen2_layer/body/illness.png';
  const body4 = './gen2_layer/body/invertedsolana.png';
  const body5 = './gen2_layer/body/invisiblerich.png';
  const body6 = './gen2_layer/body/multipleillness.png';
  const body7 = './gen2_layer/body/solana.png';
  const body8 = './gen2_layer/body/whitetrash.png';
  const body9 = './gen2_layer/body/none.png';
  const bodies = [body1, body2, body3, body4, body5, body6, body7, body8, body9]
  const [selectedGen2Body, setselectedGen2Body] = useState(bodies[8])
  const nextGen2Body = async () => {
    const currentIndex = bodies.indexOf(selectedGen2Body);
    const nextGen2Index = (currentIndex + 1) % bodies.length;
    setselectedGen2Body(bodies[nextGen2Index])
  }
  const prevGen2Body = async () => {
    const currentIndex = bodies.indexOf(selectedGen2Body);
    const nextGen2Index = (currentIndex - 1) % bodies.length;
    if (nextGen2Index < 0)
      setselectedGen2Body(bodies[bodies.length - 1])
    else
      setselectedGen2Body(bodies[nextGen2Index])
  }

  const dna1 = './gen2_layer/dna/$SOLwarrior.png';
  const dna2 = './gen2_layer/dna/420boi.png';
  const dna3 = './gen2_layer/dna/agent47.png';
  const dna4 = './gen2_layer/dna/blood.png';
  const dna5 = './gen2_layer/dna/burner.png';
  const dna6 = './gen2_layer/dna/chapo.png';
  const dna7 = './gen2_layer/dna/crip.png';
  const dna8 = './gen2_layer/dna/escobar.png';
  const dna9 = './gen2_layer/dna/ese.png';
  const dna10 = './gen2_layer/dna/fisherman.png';
  const dna11 = './gen2_layer/dna/gamer.png';
  const dna12 = './gen2_layer/bdna/heisenberg.png';
  const dna13 = './gen2_layer/dna/king.png';
  const dna14 = './gen2_layer/dna/metaboi.png';
  const dna15 = './gen2_layer/dna/nakedtruth.png';
  const dna16 = './gen2_layer/dna/pissedpants.png';
  const dna17 = './gen2_layer/dna/pnsqrtboi.png';
  const dna18 = './gen2_layer/dna/scarface.png';
  const dna19 = './gen2_layer/dna/soljunkboi.png';
  const dna20 = './gen2_layer/dna/soljunkgirl.png';
  const dna21 = './gen2_layer/dna/soljunkgirlblonde.png';
  const dnas = [dna1, dna2, dna3, dna4, dna5, dna6, dna7, dna8, dna9, dna10, dna11, dna12, dna13, dna14, dna15, dna16, dna17, dna18, dna19, dna20, dna21]
  const [selectedGen2DNA, setselectedGen2DNA] = useState(dnas[14])
  const nextGen2DNA = async () => {
    const currentIndex = dnas.indexOf(selectedGen2DNA);
    const nextGen2Index = (currentIndex + 1) % dnas.length;
    setselectedGen2DNA(dnas[nextGen2Index])
  }
  const prevGen2DNA = async () => {
    const currentIndex = dnas.indexOf(selectedGen2DNA);
    const nextGen2Index = (currentIndex - 1) % dnas.length;
    if (nextGen2Index < 0)
      setselectedGen2DNA(dnas[dnas.length - 1])
    else
      setselectedGen2DNA(dnas[nextGen2Index])
  }

  const mouth1 = './gen2_layer/mouth/blunt.png';
  const mouth2 = './gen2_layer/mouth/cigarette.png';
  const mouth3 = './gen2_layer/mouth/normal.png';
  const mouth4 = './gen2_layer/mouth/opened.png';
  const mouth5 = './gen2_layer/mouth/rottenteeth.png';
  const mouth6 = './gen2_layer/mouth/sad.png';
  const mouth7 = './gen2_layer/mouth/shineywhiteteeth.png';
  const mouth8 = './gen2_layer/mouth/vapoballon.png';
  const mouth9 = './gen2_layer/mouth/none.png';
  const mouths = [mouth1, mouth2, mouth3, mouth4, mouth5, mouth6, mouth7, mouth8, mouth9]
  const [selectedGen2Mouth, setselectedGen2Mouth] = useState(mouths[8])
  const nextGen2Mouth = async () => {
    const currentIndex = mouths.indexOf(selectedGen2Mouth);
    const nextGen2Index = (currentIndex + 1) % mouths.length;
    setselectedGen2Mouth(mouths[nextGen2Index])
  }
  const prevGen2Mouth = async () => {
    const currentIndex = mouths.indexOf(selectedGen2Mouth);
    const nextGen2Index = (currentIndex - 1) % mouths.length;
    if (nextGen2Index < 0)
      setselectedGen2Mouth(mouths[mouths.length - 1])
    else
      setselectedGen2Mouth(mouths[nextGen2Index])
  }

  const eye1 = './gen2_layer/eyes/alien.png';
  const eye2 = './gen2_layer/eyes/bluelaser.png';
  const eye3 = './gen2_layer/eyes/bullish.png';
  const eye4 = './gen2_layer/eyes/enlightend.png';
  const eye5 = './gen2_layer/eyes/heisenberg.png';
  const eye6 = './gen2_layer/eyes/heisenstoned.png';
  const eye7 = './gen2_layer/eyes/left.png';
  const eye8 = './gen2_layer/eyes/metaglasses.png';
  const eye9 = './gen2_layer/eyes/none.png';
  const eye10 = './gen2_layer/eyes/normal.png';
  const eye11 = './gen2_layer/eyes/red.png';
  const eye12 = './gen2_layer/eyes/redlaser.png';
  const eye13 = './gen2_layer/eyes/right.png';
  const eye14 = './gen2_layer/eyes/soltear.png';
  const eye15 = './gen2_layer/eyes/stoner.png';
  const eye16 = './gen2_layer/eyes/tee.png';
  const eyes = [eye1, eye2, eye3, eye4, eye5, eye6, eye7, eye8, eye9, eye10, eye11, eye12, eye13, eye14, eye15, eye16]
  const [selectedGen2Eye, setselectedGen2Eye] = useState(eyes[8])
  const nextGen2Eyes = async () => {
    const currentIndex = eyes.indexOf(selectedGen2Eye);
    const nextGen2Index = (currentIndex + 1) % eyes.length;
    setselectedGen2Eye(eyes[nextGen2Index])
  }
  const prevGen2Eyes = async () => {
    const currentIndex = eyes.indexOf(selectedGen2Eye);
    const nextGen2Index = (currentIndex - 1) % eyes.length;
    if (nextGen2Index < 0)
      setselectedGen2Eye(eyes[eyes.length - 1])
    else
      setselectedGen2Eye(eyes[nextGen2Index])
  }

  const chain1 = './gen2_layer/chains/$SOLCross.png';
  const chain2 = './gen2_layer/chains/2chainz.png';
  const chain3 = './gen2_layer/chains/gold.png';
  const chain4 = './gen2_layer/chains/inforthetech.png';
  const chain5 = './gen2_layer/chains/none.png';
  const chain6 = './gen2_layer/chains/silver.png';
  const chain7 = './gen2_layer/chains/silvergoldcross.png';
  const chain8 = './gen2_layer/chains/solchain.png';
  const chains = [chain1, chain2, chain3, chain4, chain5, chain6, chain7, chain8]
  const [selectedGen2Chain, setselectedGen2Chain] = useState(chains[4])
  const nextGen2Chain = async () => {
    const currentIndex = chains.indexOf(selectedGen2Chain);
    const nextGen2Index = (currentIndex + 1) % chains.length;
    setselectedGen2Chain(chains[nextGen2Index])
  }
  const prevGen2Chain = async () => {
    const currentIndex = chains.indexOf(selectedGen2Chain);
    const nextGen2Index = (currentIndex - 1) % chains.length;
    if (nextGen2Index < 0)
      setselectedGen2Chain(chains[chains.length - 1])
    else
      setselectedGen2Chain(chains[nextGen2Index])
  }

  const object1 = './gen2_layer/object/ak.png';
  const object2 = './gen2_layer/object/axe.png';
  const object3 = './gen2_layer/object/bat.png';
  const object4 = './gen2_layer/object/bloodybat.png';
  const object5 = './gen2_layer/object/bloodyknife.png';
  const object6 = './gen2_layer/object/bloodymarill.png';
  const object7 = './gen2_layer/object/bottle.png';
  const object8 = './gen2_layer/object/burner.png';
  const object9 = './gen2_layer/object/butcher.png';
  const object10 = './gen2_layer/object/granade.png';
  const object11 = './gen2_layer/object/gun.png';
  const object12 = './gen2_layer/bobject/hammer.png';
  const object13 = './gen2_layer/object/knife.png';
  const object14 = './gen2_layer/object/lean.png';
  const object15 = './gen2_layer/object/lid.png';
  const object16 = './gen2_layer/object/lucille.png';
  const object17 = './gen2_layer/object/machinegun.png';
  const object18 = './gen2_layer/object/molotov.png';
  const object19 = './gen2_layer/object/none.png';
  const object20 = './gen2_layer/object/plunger.png';
  const object21 = './gen2_layer/object/scepter.png';
  const object22 = './gen2_layer/object/solwarrior.png';
  const object23 = './gen2_layer/object/sword.png';
  const object24 = './gen2_layer/object/taser.png';
  const objects = [object1, object2, object3, object4, object5, object6, object7, object8, object9, object10, object11, object12, object13, object14, object15, object16, object17, object18, object19, object20, object21, object22, object23, object24]
  const [selectedGen2Object, setselectedGen2Object] = useState(objects[18])
  const nextGen2Object = async () => {
    const currentIndex = objects.indexOf(selectedGen2Object);
    const nextGen2Index = (currentIndex + 1) % objects.length;
    setselectedGen2Object(objects[nextGen2Index])
  }
  const prevGen2Object = async () => {
    const currentIndex = objects.indexOf(selectedGen2Object);
    const nextGen2Index = (currentIndex - 1) % objects.length;
    if (nextGen2Index < 0)
      setselectedGen2Object(objects[objects.length - 1])
    else
      setselectedGen2Object(objects[nextGen2Index])
  }

  const prob1 = './gen2_layer/probs/0,00.png';
  const prob2 = './gen2_layer/probs/0,01.png';
  const prob3 = './gen2_layer/probs/420.png';
  const prob4 = './gen2_layer/probs/1000SOL.png';
  const prob5 = './gen2_layer/probs/deadtrash.png';
  const prob6 = './gen2_layer/probs/fckwl.png';
  const prob7 = './gen2_layer/probs/gm.png';
  const prob8 = './gen2_layer/probs/gn.png';
  const prob9 = './gen2_layer/probs/lean.png';
  const prob10 = './gen2_layer/probs/none.png';
  const prob11 = './gen2_layer/probs/rug.png';
  const prob12 = './gen2_layer/probs/tarde.png';
  const prob13 = './gen2_layer/probs/temporaryg.png';
  const prob14 = './gen2_layer/probs/theeye.png';
  const prob15 = './gen2_layer/probs/truk.png';
  const prob16 = './gen2_layer/probs/truktruktruklettering.png';
  const probs = [prob1, prob2, prob3, prob4, prob5, prob6, prob7, prob8, prob9, prob10, prob11, prob12, prob13, prob14, prob15, prob16]
  const [selectedGen2Prob, setselectedGen2Prob] = useState(probs[9])
  const nextGen2Prob = async () => {
    const currentIndex = probs.indexOf(selectedGen2Prob);
    const nextGen2Index = (currentIndex + 1) % probs.length;
    setselectedGen2Prob(probs[nextGen2Index])
  }
  const prevGen2Prob = async () => {
    const currentIndex = probs.indexOf(selectedGen2Prob);
    const nextGen2Index = (currentIndex - 1) % probs.length;
    setselectedGen2Prob(probs[nextGen2Index])
  }

  //RUDECANS
  const rcbg1 = './rudecans_layer/bg/blue.png';
  const rcbg2 = './rudecans_layer/bg/grey.png';
  const rcbg3 = './rudecans_layer/bg/invertedsolana.png';
  const rcbg4 = './rudecans_layer/bg/pink.png';
  const rcbg5 = './rudecans_layer/bg/red.png';
  const rcbg6 = './rudecans_layer/bg/solana.png';
  const rcbg7 = './rudecans_layer/bg/turqoise.png';
  const rcbg8 = './rudecans_layer/bg/violet.png';
  const rcbg9 = './rudecans_layer/bg/yellow.png';
  const rcbg10 = './rudecans_layer/bg/alpine.png';
  const rcbg11 = './rudecans_layer/bg/bars.png';
  const rcbg12 = './rudecans_layer/bg/beach.png';
  const rcbg13 = './rudecans_layer/bg/case.png';
  const rcbg14 = './rudecans_layer/bg/club.png';
  const rcbg15 = './rudecans_layer/bg/desert.png';
  const rcbg16 = './rudecans_layer/bg/detroit.png';
  const rcbg17 = './rudecans_layer/bg/dump1.png';
  const rcbg18 = './rudecans_layer/bg/fallen.png';
  const rcbg19 = './rudecans_layer/bg/ghosttown.png';
  const rcbg20 = './rudecans_layer/bg/harbour.png';
  const rcbg21 = './rudecans_layer/bg/hollywood.png';
  const rcbg22 = './rudecans_layer/bg/home.png';
  const rcbg23 = './rudecans_layer/bg/hood.png';
  const rcbg24 = './rudecans_layer/bg/house.png';
  const rcbg25 = './rudecans_layer/bg/kakaberg.png';
  const rcbg26 = './rudecans_layer/bg/moon.png';
  const rcbg27 = './rudecans_layer/bg/nsfw.png';
  const rcbg28 = './rudecans_layer/bg/oilpng';
  const rcbg29 = './rudecans_layer/bg/palace.png';
  const rcbg30 = './rudecans_layer/bg/plane.png';
  const rcbg31 = './rudecans_layer/bg/radioactive.png';
  const rcbg32 = './rudecans_layer/bg/redplanet.png';
  const rcbg33 = './rudecans_layer/bg/red.png';
  const rcbg34 = './rudecans_layer/bg/solana.png';
  const rcbg35 = './rudecans_layer/bg/somewhere.png';
  const rcbg36 = './rudecans_layer/bg/southcentral.png';
  const rcbg37 = './rudecans_layer/bg/square.png';
  const rcbg38 = './rudecans_layer/bg/thorne.png';
  const rcbg39 = './rudecans_layer/bg/trains.png';
  const rcbg40 = './rudecans_layer/bg/grey.png';
  const rcbg41 = './rudecans_layer/bg/invertedsolana.png';
  const rcbgs = [rcbg1, rcbg2, rcbg3, rcbg4, rcbg5, rcbg6, rcbg7, rcbg8, rcbg9, rcbg10, rcbg11, rcbg12, rcbg13, rcbg14, rcbg15, rcbg16, rcbg17, rcbg18, rcbg19, rcbg20, rcbg21, rcbg22, rcbg23, rcbg24, rcbg25, rcbg26, rcbg27, rcbg28, rcbg29, rcbg30, rcbg31, rcbg32, rcbg33, rcbg34, rcbg35, rcbg36, rcbg37, rcbg38, rcbg39, rcbg40, rcbg41]
  const [selectedRudeCansBG, setselectedRudeCansBG] = useState(rcbgs[9])
  const nextRudeCansBG = async () => {
    const currentIndex = rcbgs.indexOf(selectedRudeCansBG);
    const nextRudeCansIndex = (currentIndex + 1) % rcbgs.length;
    setselectedRudeCansBG(rcbgs[nextRudeCansIndex])
  }
  const prevRudeCansBG = async () => {
    const currentIndex = rcbgs.indexOf(selectedRudeCansBG);
    const nextRudeCansIndex = (currentIndex - 1) % rcbgs.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansBG(rcbgs[rcbgs.length - 1])
    else
      setselectedRudeCansBG(rcbgs[nextRudeCansIndex])
  }

  const rcbody1 = './rudecans_layer/body/blue.png';
  const rcbody2 = './rudecans_layer/body/curved.png';
  const rcbody3 = './rudecans_layer/body/green.png';
  const rcbody4 = './rudecans_layer/body/invertedsol.png';
  const rcbody5 = './rudecans_layer/body/purple.png';
  const rcbody6 = './rudecans_layer/body/red.png';
  const rcbody7 = './rudecans_layer/body/silver.png';
  const rcbody8 = './rudecans_layer/body/sol.png';
  const rcbody9 = './rudecans_layer/body/yellow.png';
  const rcbodies = [rcbody1, rcbody2, rcbody3, rcbody4, rcbody5, rcbody6, rcbody7, rcbody8, rcbody9]
  const [selectedRudeCansBody, setselectedRudeCansBody] = useState(rcbodies[8])
  const nextRudeCansBody = async () => {
    const currentIndex = rcbodies.indexOf(selectedRudeCansBody);
    const nextRudeCansIndex = (currentIndex + 1) % rcbodies.length;
    setselectedRudeCansBody(rcbodies[nextRudeCansIndex])
  }
  const prevRudeCansBody = async () => {
    const currentIndex = rcbodies.indexOf(selectedRudeCansBody);
    const nextRudeCansIndex = (currentIndex - 1) % rcbodies.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansBody(rcbodies[rcbodies.length - 1])
    else
      setselectedRudeCansBG(rcbodies[nextRudeCansIndex])
  }

  const rcmouth1 = './rudecans_layer/mouth/fake.png';
  const rcmouth2 = './rudecans_layer/mouth/greendot.png';
  const rcmouth3 = './rudecans_layer/mouth/nevertalk.png';
  const rcmouth4 = './rudecans_layer/mouth/notalking.png';
  const rcmouth5 = './rudecans_layer/mouth/opentetris.png';
  const rcmouth6 = './rudecans_layer/mouth/opened.png';
  const rcmouth7 = './rudecans_layer/mouth/recycle.png';
  const rcmouth8 = './rudecans_layer/mouth/tetris.png';
  const rcmouth9 = './rudecans_layer/mouth/toomuch.png';
  const rcmouths = [rcmouth1, rcmouth2, rcmouth3, rcmouth4, rcmouth5, rcmouth6, rcmouth7, rcmouth8, rcmouth9]
  const [selectedRudeCansMouth, setselectedRudeCansMouth] = useState(rcmouths[8])
  const nextRudeCansMouth = async () => {
    const currentIndex = rcmouths.indexOf(selectedRudeCansMouth);
    const nextRudeCansIndex = (currentIndex + 1) % rcmouths.length;
    setselectedRudeCansMouth(rcmouths[nextRudeCansIndex])
  }
  const prevRudeCansMouth = async () => {
    const currentIndex = rcmouths.indexOf(selectedRudeCansMouth);
    const nextRudeCansIndex = (currentIndex - 1) % rcmouths.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansMouth(rcmouths[rcmouths.length - 1])
    else
      setselectedRudeCansMouth(rcmouths[nextRudeCansIndex])
  }

  const fist1 = './rudecans_layer/fists/blood.png';
  const fist2 = './rudecans_layer/fists/fackfinga.png';
  const fist3 = './rudecans_layer/fists/fight.png';
  const fist4 = './rudecans_layer/fists/fist.png';
  const fist5 = './rudecans_layer/fists/fuckfinga.png';
  const fist6 = './rudecans_layer/fists/fuckfingadouble.png';
  const fist7 = './rudecans_layer/fists/none.png';
  const fist8 = './rudecans_layer/fists/rolin.png';
  const fist9 = './rudecans_layer/fists/spliff.png';
  const fist10 = './rudecans_layer/fists/thugfinga.png';
  const fists = [fist1, fist2, fist3, fist4, fist5, fist6, fist7, fist8, fist9, fist10]
  const [selectedRudeCansFists, setselectedRudeCansFists] = useState(fists[0])
  const nextRudeCansFists = async () => {
    const currentIndex = fists.indexOf(selectedRudeCansFists);
    const nextRudeCansIndex = (currentIndex + 1) % fists.length;
    setselectedRudeCansFists(fists[nextRudeCansIndex])
  }
  const prevRudeCansFists = async () => {
    const currentIndex = fists.indexOf(selectedRudeCansFists);
    const nextRudeCansIndex = (currentIndex - 1) % fists.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansFists(fists[fists.length - 1])
    else
      setselectedRudeCansFists(fists[nextRudeCansIndex])
  }

  const rceye1 = './rudecans_layer/eyes/baked.png';
  const rceye2 = './rudecans_layer/eyes/bored.png';
  const rceye3 = './rudecans_layer/eyes/cry.png';
  const rceye4 = './rudecans_layer/eyes/frightend.png';
  const rceye5 = './rudecans_layer/eyes/green.png';
  const rceye6 = './rudecans_layer/eyes/laser.png';
  const rceye7 = './rudecans_layer/eyes/morebored.png';
  const rceye8 = './rudecans_layer/eyes/normal.png';
  const rceye9 = './rudecans_layer/eyes/straight.png';
  const rceye10 = './rudecans_layer/eyes/tee.png';
  const rceyes = [rceye1, rceye2, rceye3, rceye4, rceye5, rceye6, rceye7, rceye8, rceye9, rceye10]
  const [selectedRudeCansEye, setselectedRudeCansEye] = useState(rceyes[8])
  const nextRudeCansEyes = async () => {
    const currentIndex = rceyes.indexOf(selectedRudeCansEye);
    const nextRudeCansIndex = (currentIndex + 1) % rceyes.length;
    setselectedRudeCansEye(rceyes[nextRudeCansIndex])
  }
  const prevRudeCansEyes = async () => {
    const currentIndex = rceyes.indexOf(selectedRudeCansEye);
    const nextRudeCansIndex = (currentIndex - 1) % rceyes.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansEye(rceyes[rceyes.length - 1])
    else
      setselectedRudeCansEye(rceyes[nextRudeCansIndex])
  }

  const daylight1 = './rudecans_layer/daylight/day.png';
  const daylight2 = './rudecans_layer/daylight/night.png';
  const daylights = [daylight1, daylight2]
  const [selectedRudeCansDaylight, setselectedRudeCansDaylight] = useState(daylights[0])
  const nextRudeCansDaylight = async () => {
    const currentIndex = daylights.indexOf(selectedRudeCansDaylight);
    const nextRudeCansIndex = (currentIndex + 1) % daylights.length;
    setselectedRudeCansDaylight(daylights[nextRudeCansIndex])
  }
  const prevRudeCansDaylight = async () => {
    const currentIndex = daylights.indexOf(selectedRudeCansDaylight);
    const nextRudeCansIndex = (currentIndex - 1) % daylights.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansDaylight(daylights[daylights.length - 1])
    else
      setselectedRudeCansDaylight(daylights[nextRudeCansIndex])
  }

  const proberty1 = './rudecans_layer/prob/agenda.png';
  const proberty2 = './rudecans_layer/prob/apec.png';
  const proberty3 = './rudecans_layer/prob/apple.png';
  const proberty4 = './rudecans_layer/prob/balenciaga.png';
  const proberty5 = './rudecans_layer/prob/bearmarket.png';
  const proberty6 = './rudecans_layer/prob/bodybag.png';
  const proberty7 = './rudecans_layer/prob/burn.png';
  const proberty8 = './rudecans_layer/prob/burningearth.png';
  const proberty9 = './rudecans_layer/prob/clown.png';
  const proberty10 = './rudecans_layer/prob/coke.png';
  const proberty11 = './rudecans_layer/prob/disney.png';
  const proberty12 = './rudecans_layer/prob/earth.png';
  const proberty13 = './rudecans_layer/prob/facebook.png';
  const proberty14 = './rudecans_layer/prob/fifa.png';
  const proberty15 = './rudecans_layer/prob/franke.png';
  const proberty16 = './rudecans_layer/prob/frankeCopy.png';
  const proberty17 = './rudecans_layer/prob/granddaddySchwab.png';
  const proberty18 = './rudecans_layer/prob/instagram.png';
  const proberty19 = './rudecans_layer/prob/lidnotfinished.png';
  const proberty20 = './rudecans_layer/prob/magicalparadise.png';
  const proberty21 = './rudecans_layer/prob/moneyman.png';
  const proberty22 = './rudecans_layer/prob/none.png';
  const proberty23 = './rudecans_layer/prob/pfizer.png';
  const proberty24 = './rudecans_layer/prob/rainbow.png';
  const proberty25 = './rudecans_layer/prob/sam.png';
  const proberty26 = './rudecans_layer/prob/silverlidclosed.png';
  const probertys = [proberty1, proberty2, proberty3, proberty4, proberty5, proberty6, proberty7, proberty8, proberty9, proberty10, proberty11, proberty12, proberty13, proberty14, proberty15, proberty16, proberty17, proberty18, proberty19, proberty20, proberty21, proberty22, proberty23, proberty24, proberty25, proberty26]
  const [selectedRudeCansProberty, setselectedRudeCansProberty] = useState(probertys[9])
  const nextRudeCansProberty = async () => {
    const currentIndex = probertys.indexOf(selectedRudeCansProberty);
    const nextRudeCansIndex = (currentIndex + 1) % probertys.length;
    setselectedRudeCansProberty(probertys[nextRudeCansIndex])
  }
  const prevRudeCansProberty = async () => {
    const currentIndex = probertys.indexOf(selectedRudeCansProberty);
    const nextRudeCansIndex = (currentIndex - 1) % probertys.length;
    if (nextRudeCansIndex < 0)
      setselectedRudeCansProberty(probertys[probertys.length - 1])
    else
      setselectedRudeCansProberty(probertys[nextRudeCansIndex])
  }

  //CUSTOM VIEW
  const custom_layer1 = './none.png';
  const custom_layer2 = './none.png';
  const custom_layer3 = './none.png';
  const custom_layer4 = './none.png';
  const custom_layer5 = './none.png';
  const custom_layer6 = './none.png';
  const [selectedCustomLayer1, setselectedCustomLayer1] = useState(custom_layer1)
  const [selectedCustomLayer2, setselectedCustomLayer2] = useState(custom_layer2)
  const [selectedCustomLayer3, setselectedCustomLayer3] = useState(custom_layer3)
  const [selectedCustomLayer4, setselectedCustomLayer4] = useState(custom_layer4)
  const [selectedCustomLayer5, setselectedCustomLayer5] = useState(custom_layer5)
  const [selectedCustomLayer6, setselectedCustomLayer6] = useState(custom_layer6)

  //CUSTOM LAYER FILE UPLOAD
  const convertBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const handleFileChange1 = async (event: any) => {
    const file = event.target.files[0]
    console.log(file)
    const base64: any = await convertBase64(file)
    setselectedCustomLayer1(base64)
  }

  const handleFileChange2 = async (event: any) => {
    const file = event.target.files[0]
    console.log(file)
    const base64: any = await convertBase64(file)
    setselectedCustomLayer2(base64)
  }

  const handleFileChange3 = async (event: any) => {
    const file = event.target.files[0]
    console.log(file)
    const base64: any = await convertBase64(file)
    setselectedCustomLayer3(base64)
  }

  const handleFileChange4 = async (event: any) => {
    const file = event.target.files[0]
    console.log(file)
    const base64: any = await convertBase64(file)
    setselectedCustomLayer4(base64)
  }

  //TEXT RELATED
  const [upperMsg, setUpperMsg] = useState('')
  const [lowerMsg, setLowerMsg] = useState('')
  const [isGenerated, setIsGenerated] = useState(false);
  const [sending, setSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [upperTextSize, setUpperTextSize] = useState(3)
  const [lowerTextSize, setLowerTextSize] = useState(3)

  const [textFont, setTextFont] = useState(1)
  const nextTextFont = async () => {
    if (textFont < 2) {
      setTextFont(textFont + 1)
    }
    else {
      setTextFont(1)
    }
  }

  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(wallet))
    .use(bundlrStorage());

  //Generate the design of the NFT message
  const generateImg = async () => {
    const canvas = await html2canvas(document.getElementById('canvas')!, {
      scale: 2
    });
    const img = canvas.toDataURL('image/png');
    return img;
  };

  const saveImgMobile = async () => {
    const canvas = await html2canvas(document.getElementById('canvasMobile')!);
    const img = canvas.toDataURL('image/png');

    downloadjs(img, 'download.png', 'image/png');
  };

  const saveImgDesktop = async () => {
    const canvas = await html2canvas(document.getElementById('canvasDesktop')!);
    const img = canvas.toDataURL('image/png');

    downloadjs(img, 'download.png', 'image/png');
  };

  const HandleUpperMsgChange = async (e: any) => {
    setUpperMsg(e.target.value);
    setIsGenerated(false);
    setErrorMsg('');
    setIsSent(false);
  };

  const HandleLowerMsgChange = async (e: any) => {
    setLowerMsg(e.target.value);
    setIsGenerated(false);
    setErrorMsg('');
    setIsSent(false);
  };

  const CreateAndSendNFT = async () => {
    try {
      setSending(true)
      const image = await generateImg();
      const _name = "SolJunksNFT BashMail"
      const description = `PNSQRT`;
      const { uri } = await metaplex.nfts().uploadMetadata({
        name: _name,
        description: description,
        image: image,
        external_url: "https://soljunks.io/"
      });
      if (uri) {
        const { nft } = await metaplex.nfts().create({
          name: _name,
          uri: uri,
          sellerFeeBasisPoints: 0,
          tokenOwner: new PublicKey(wallet),
        });

        if (nft) {
          setSending(false);
          setIsSent(true);
          setIsGenerated(false);
        };
      };
    }

    catch (errorMsg) {
      setSending(false);
      const err = (errorMsg as any)?.message;
      if (err.includes('could not find mint')) {
        setErrorMsg('The mint address seems to be wrong, verify it');
      }
      else if (err.includes('Invalid name account provided')) {
        setErrorMsg('This solana domain name does not exist')
      }
    }
  }

  const [height, setHeight] = useState(900)
  const [width, setWidth] = useState(900)
  const HandleHeightChange = async (e: any) => {
    console.log(e.target.value)
    setHeight(e.target.value)
  }
  const HandleWidthChange = async (e: any) => {
    console.log
    setWidth(e.target.value)
  }



  return (
    <div className="">
      <div className="navbar sticky top-0 z-50 text-neutral-content flex justify-between bg-gray-900">
        <div>
          <MainMenu />
        </div>
        <WalletMultiButton />
      </div>




      {/*MOBILE VIEW-------------------------------------------------------------------------------------------------------------------------------------------------------------- */}




      <div className="lg:hidden text-center">
        <div className='flex justify-center'>
          <div className=" grid grid-cols-5 p-2 text-center">
            <button className="font-pixel sm:text-3xl text-lg btn btn-primary btn-2xl rounded mr-5 col-span-1" onClick={() => prevTheme()}>⏪</button>
            {theme == 1 && <h1 className="font-pixel text-3xl rounded w-auto col-span-3">GEN 2 THEME</h1>}
            {theme == 2 && <h1 className="font-pixel text-3xl rounded w-auto col-span-3">RUDECANS THEME</h1>}
            <button className="font-pixel sm:text-3xl text-lg btn btn-primary rounded h-full ml-5 col-span-1" onClick={() => nextGen2Theme()}>⏩</button>
          </div>
        </div>
        <div className="">
          {/* MEME CANVAS - START */}
          <div className="flex justify-center mt-4">
            <div className="lg:w-[500px] lg:h-[500px] w-[400px] h-[400px] container" id="canvasMobile">
              <div className="relative">
                {theme == 1 &&
                  <div>
                    <img src={selectedGen2BG} alt='' />
                    {/* Layer 1 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Prob} alt='' />
                    </span>
                    {/* Layer 2 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Body} alt='' />
                    </span>
                    {/* Layer 3 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2DNA} alt='' />
                    </span>
                    {/* Layer 4 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Mouth} alt='' />
                    </span>
                    {/* Layer 5 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Eye} alt='' />
                    </span>
                    {/* Layer 6 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Chain} alt='' />
                    </span>
                    {/* Layer 7 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Object} alt='' />
                    </span>
                  </div>
                }
                {theme == 2 &&
                  <div>
                    {/* BG */}
                    <img src={selectedRudeCansBG} alt='' />
                    {/* Layer 1 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansBody} alt='' />
                    </span>
                    {/* Layer 2 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansMouth} alt='' />
                    </span>
                    {/* Layer 3 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansFists} alt='' />
                    </span>
                    {/* Layer 4 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansEye} alt='' />
                    </span>
                    {/* Layer 5 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansProberty} alt='' />
                    </span>
                    {/* Layer 6 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansDaylight} alt='' />
                    </span>
                  </div>
                }
                {/*UPPER MSG */}
                {upperTextSize == 1 &&
                  <h2 className="font-impact absolute text-3xl text-white top-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-1 uppercase">{upperMsg}</h2>
                }
                {upperTextSize == 2 &&
                  <h2 className="font-impact absolute text-3xl lg:text-6xl text-white top-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-1 lg:font-outline-2 uppercase">{upperMsg}</h2>
                }
                {upperTextSize == 3 &&
                  <h2 className="font-impact absolute text-3xl lg:text-9xl text-white top-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-1 lg:font-outline-4 uppercase">{upperMsg}</h2>
                }

                {/*LOWER MSG */}
                {lowerTextSize == 1 &&
                  <h2 className="font-impact absolute text-3xl text-white bottom-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-1 lg:font-outline-1 uppercase">{lowerMsg}</h2>
                }
                {lowerTextSize == 2 &&
                  <h2 className="font-impact absolute text-3xl lg:text-6xl text-white bottom-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-1 lg:font-outline-2 uppercase">{lowerMsg}</h2>
                }
                {lowerTextSize == 3 &&
                  <h2 className="font-impact absolute text-3xl lg:text-9xl text-white bottom-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-1 lg:font-outline-4 uppercase">{lowerMsg}</h2>
                }
              </div>
            </div>
          </div>
          {/* MEME CANVAS - END */}
        </div>
        <div className='flex justify-center mt-4'>
          {theme == 1 &&
            <div className=" grid grid-cols-5 p-2">
              <button className="font-pixel sm:text-3xl text-lg btn btn-primary btn-2xl rounded mr-5 col-span-1" onClick={() => prevGen2Page()}>⏪</button>
              {page == 1 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2BG()}>
                  <h1 className="font-pixel">Change Background</h1>
                </button>
              }
              {page == 2 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Body()}>
                  <h1 className="font-pixel col-span-1">Change Body</h1>
                </button>
              }
              {page == 3 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2DNA()}>
                  <h1 className="font-pixel col-span-1">Change DNA</h1>
                </button>
              }
              {page == 4 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Mouth()}>
                  <h1 className="font-pixel col-span-1">Change Mouth</h1>
                </button>
              }
              {page == 5 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Eyes()}>
                  <h1 className="font-pixel col-span-1">Change Eyes</h1>
                </button>
              }
              {page == 6 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Chain()}>
                  <h1 className="font-pixel col-span-1">Change Chain</h1>
                </button>
              }
              {page == 7 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Object()}>
                  <h1 className="font-pixel col-span-1">Change Object</h1>
                </button>
              }
              {page == 8 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextGen2Prob()}>
                  <h1 className="font-pixel col-span-1">Change Prob</h1>
                </button>
              }
              <button className="font-pixel sm:text-3xl text-lg btn btn-primary rounded h-full ml-5 col-span-1" onClick={() => nextGen2Page()}>⏩</button>
            </div>
          }
          {theme == 2 &&
            <div className=" grid grid-cols-5 p-2">
              <button className="font-pixel sm:text-3xl text-lg btn btn-primary btn-2xl rounded mr-5 col-span-1" onClick={() => prevRudeCansPage()}>⏪</button>
              {rcpage == 1 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansBG()}>
                  <h1 className="font-pixel">Change Background</h1>
                </button>
              }
              {rcpage == 2 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansBody()}>
                  <h1 className="font-pixel col-span-1">Change Body</h1>
                </button>
              }
              {rcpage == 3 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansMouth()}>
                  <h1 className="font-pixel col-span-1">Change Mouth</h1>
                </button>
              }
              {rcpage == 4 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansFists()}>
                  <h1 className="font-pixel col-span-1">Change Fists</h1>
                </button>
              }
              {rcpage == 5 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansEyes()}>
                  <h1 className="font-pixel col-span-1">Change Eyes</h1>
                </button>
              }
              {rcpage == 6 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansProberty()}>
                  <h1 className="font-pixel col-span-1">Change Proberty</h1>
                </button>
              }
              {rcpage == 7 &&
                <button className="btn btn-secondary btn-2xl font-pixel sm:text-3xl text-lg rounded w-auto col-span-3" onClick={() => nextRudeCansDaylight()}>
                  <h1 className="font-pixel col-span-1">Change Daylight</h1>
                </button>
              }
              <button className="font-pixel sm:text-3xl text-lg btn btn-primary rounded h-full ml-5 col-span-1" onClick={() => nextRudeCansPage()}>⏩</button>
            </div>
          }
        </div>
        <div className="flex justify-center p-2 mt-2">
          <input className="font-pixel text-black pl-1 border-1 border-black sm:w-[290px] w-[100%] text-center h-10 rounded mr-5"
            type="text"
            required
            placeholder="Upper Text"
            maxLength={15}
            onChange={HandleUpperMsgChange}
          />
          <input className="font-pixel text-black pl-1 border-1 border-black sm:w-[290px] w-[100%] text-center h-10 rounded"
            type="text"
            required
            placeholder="Lower Text"
            maxLength={30}
            onChange={HandleLowerMsgChange}
          />
        </div>
        <div className="flex justify-center mt-2">
          <button className="font-pixel btn btn-sm mr-2 btn-secondary" onClick={nextTextColor}>Change Text Color</button>
        </div>
        <div className="mt-4 flex justify-center p-2">
          <button className="font-pixel btn mr-2 btn-primary"
            onClick={saveImgMobile}>Download Image
          </button>

          {sending == false &&
            <button className="font-pixel btn btn-primary"
              onClick={CreateAndSendNFT}>Mint as NFT
            </button>}

          {sending == true &&
            <button className="btn btn-primary">
              <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>Minting</button>}

          {errorMsg != '' &&
            <div className="mt-[1%]">❌ Ohoh.. An error occurs: {errorMsg}
            </div>
          }

          {isSent &&
            <div className="font-pixel text-xl mt-[5%]">
              ✅ Successfully minted!
            </div>}
        </div>
      </div>




      {/*DESKTOP VIEW------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}




      <div className="hidden lg:flex ">
        <div className='grid grid-cols-4'>
          {/*TOOLBAR MEMEMAKER*/}
          <div className="grid grid-rows-8 gap-4 bg-gray-900 col-span-1">
            <div className="flex justify-center gap-1 p-1">
              <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => setGen2Theme(1)}>GEN 2</button>
              <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => setGen2Theme(2)}>RUDECANS</button>
              <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => setGen2Theme(3)}>CUSTOM</button>
            </div>
            <div className='mt-4'>
              {theme == 1 &&
                <div className="p-2">
                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevGen2BG()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Background</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextGen2BG()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevGen2Body()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Body</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextGen2Body()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevGen2DNA()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change DNA</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextGen2DNA()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevGen2Mouth()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Mouth</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextGen2Mouth()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevGen2Eyes()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Eyes</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextGen2Eyes()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevGen2Chain()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Chain</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextGen2Chain()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevGen2Object()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Object</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextGen2Object()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevGen2Prob()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Prob</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextGen2Prob()}>⏩</button>
                  </div>
                </div>
              }
              {theme == 2 &&
                <div className="p-2">
                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansBG()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Background</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansBG()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansBody()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Body</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansBody()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansMouth()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Mouth</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansMouth()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansFists()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Fists</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansFists()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansEyes()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Eyes</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansEyes()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansProberty()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Proberty</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansProberty()}>⏩</button>
                  </div>

                  <div className="row-span-1 grid grid-cols-5 text-center mb-2">
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => prevRudeCansDaylight()}>⏪</button>
                    <h1 className="font-pixel col-span-3">Change Daylight</h1>
                    <button className="font-pixel btn btn-primary btn-sm rounded col-span-1" onClick={() => nextRudeCansDaylight()}>⏩</button>
                  </div>
                </div>
              }
            </div>
            <div className="p-2">
              <div>
                <input className="font-pixel text-black pl-1 border-1 border-black w-[100%] text-center h-10 rounded mb-1"
                  type="text"
                  required
                  placeholder="Upper Text"
                  onChange={HandleUpperMsgChange}
                />
                <div className="flex justify-between mt-1">
                  <h1 className="font-pixel">Text Size:</h1>
                  <div className="flex justify-center gap-2">
                    <button className={` ${upperTextSize === 1 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm btn-secondary`} onClick={() => setUpperTextSize(1)}>small</button>
                    <button className={` ${upperTextSize === 2 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm btn-secondary`} onClick={() => setUpperTextSize(2)}>LARGE</button>
                    <button className={` ${upperTextSize === 3 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm btn-secondary`} onClick={() => setUpperTextSize(3)}>BIG</button>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <input className="font-pixel text-black pl-1 border-1 border-black w-[100%] text-center h-10 rounded"
                  type="text"
                  required
                  placeholder="Lower Text"
                  onChange={HandleLowerMsgChange}
                />
                <div className="flex justify-between mt-1">
                  <h1 className="font-pixel">Text Size:</h1>
                  <div className="flex justify-center gap-2">
                    <button className={` ${lowerTextSize === 1 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm btn-secondary`} onClick={() => setLowerTextSize(1)}>small</button>
                    <button className={` ${lowerTextSize === 2 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm btn-secondary`} onClick={() => setLowerTextSize(2)}>LARGE</button>
                    <button className={` ${lowerTextSize === 3 ? "bg-purple-600 text-white" : "bg-gray-700"} font-pixel btn btn-sm btn-secondary`} onClick={() => setLowerTextSize(3)}>BIG</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="mt-4 text-center">
                {sending == false &&
                  <button className="font-pixel btn btn-primary btn-lg text-3xl w-full mb-2"
                    onClick={CreateAndSendNFT}>Mint as NFT
                  </button>}

                {sending == true &&
                  <button className="btn btn-primary w-full">
                    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>Minting</button>}

                {errorMsg != '' &&
                  <div className="mt-[1%] w-full">❌ Ohoh.. An error occurs: {errorMsg}
                  </div>
                }

                {isSent &&
                  <div className="font-pixel text-xl mt-[5%] w-full">
                    ✅ Successfully minted!
                  </div>}

                <button className="font-pixel btn btn-primary btn-sm mt-8"
                  onClick={saveImgDesktop}>Download Image
                </button>
              </div>
            </div>
          </div>
          {/* MEME CANVAS - START */}
          <div className="flex flex-col justify-center items-center col-span-2 w-auto">
            <div className={`w-[800px] h-[800px] container text-center border-1 border-black`} id="canvasDesktop">
              <div className="relative">
                {theme == 1 &&
                  <div>
                    <img src={selectedGen2BG} alt='' />
                    {/* Layer 1 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Prob} alt='' />
                    </span>
                    {/* Layer 2 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Body} alt='' />
                    </span>
                    {/* Layer 3 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2DNA} alt='' />
                    </span>
                    {/* Layer 4 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Mouth} alt='' />
                    </span>
                    {/* Layer 5 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Eye} alt='' />
                    </span>
                    {/* Layer 6 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Chain} alt='' />
                    </span>
                    {/* Layer 7 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedGen2Object} alt='' />
                    </span>
                  </div>
                }
                {theme == 2 &&
                  <div>
                    {/* BG */}
                    <img src={selectedRudeCansBG} alt='' />
                    {/* Layer 1 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansBody} alt='' />
                    </span>
                    {/* Layer 2 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansMouth} alt='' />
                    </span>
                    {/* Layer 3 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansFists} alt='' />
                    </span>
                    {/* Layer 4 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansEye} alt='' />
                    </span>
                    {/* Layer 5 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansProberty} alt='' />
                    </span>
                    {/* Layer 6 */}
                    <span className="absolute top-0 left-0">
                      <img src={selectedRudeCansDaylight} alt='' />
                    </span>
                  </div>
                }{theme == 3 &&
                  <div className="border-2">
                    {/* BG */}
                    <ArtBoard background={selectedCustomLayer1} />
                    {/* Layer 1 
                    <span className="absolute top-0 left-0">
                      <img src={selectedCustomLayer2} alt='' />
                    </span>
                    <span className="absolute top-0 left-0">
                      <img src={selectedCustomLayer3} alt='' />
                    </span>
                    <span className="absolute top-0 left-0">
                      <img src={selectedCustomLayer4} alt='' />
                    </span>
                    <span className="absolute top-0 left-0">
                      <img src={selectedCustomLayer5} alt='' />
                    </span>
                    <div className="container">
                      <div className="target5">
                        <span className="absolute top-0 left-0">
                          <img src={selectedCustomLayer6} alt='' />
                        </span></div>
                      <Moveable
                        target={target}
                        draggable={true}
                        scalable={true}
                        keepRatio={true}
                        rotatable={true}
                        onDragStart={helper.onDragStart}
                        onDrag={helper.onDrag}
                        onScaleStart={helper.onScaleStart}
                        onScale={helper.onScale}
                        onRotateStart={helper.onRotateStart}
                        onRotate={helper.onRotate}
                      />
                    </div>*/}
                  </div>
                }
                {/*UPPER MSG */}
                {upperTextSize == 1 &&
                  <h2 className="font-impact absolute text-3xl text-white top-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-1 uppercase">{upperMsg}</h2>
                }
                {upperTextSize == 2 &&
                  <h2 className="font-impact absolute text-6xl text-white top-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-2 uppercase">{upperMsg}</h2>
                }
                {upperTextSize == 3 &&
                  <h2 className="font-impact absolute text-9xl text-white top-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-4 uppercase">{upperMsg}</h2>
                }

                {/*LOWER MSG */}
                {lowerTextSize == 1 &&
                  <h2 className="font-impact absolute text-3xl text-white bottom-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-1 uppercase">{lowerMsg}</h2>
                }
                {lowerTextSize == 2 &&
                  <h2 className="font-impact absolute text-6xl text-white bottom-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-2 uppercase">{lowerMsg}</h2>
                }
                {lowerTextSize == 3 &&
                  <h2 className="font-impact absolute text-9xl text-white bottom-4 left-1/2 -translate-x-1/2 break-words w-[90%] font-outline-4 uppercase">{lowerMsg}</h2>
                }
              </div>
            </div>
          </div>
          {/* MEME CANVAS - END */}
          {theme == 3 &&
            <div className="grid bg-gray-900 col-span-1">
              <div className="p-2 flex justify-between">
                <form className="mb-2">
                  <label htmlFor="file" className="btn btn-primary font-pixel">
                    Select Background
                    <input
                      id="file"
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={handleFileChange1}
                      style={{ display: 'none' }} />
                  </label>
                </form>
                <button className="btn btn-primary font-pixel">
                  add new layer
                </button>
              </div>
              {elements?.map((num: any) => (
                <button className="btn btn-secondary font-pixel" key={num}>
                  {num.key}
                </button>))}
            </div>
          }
        </div>
      </div>
    </div>
  );
};