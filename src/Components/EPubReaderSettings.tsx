import { faBars, faMinus, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useEffect, useLayoutEffect, useState } from "react";
import { setEpubReaderSettings } from "../store/appSettings";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getFonts } from "font-list";
import { InputSelect } from "./Element/InputSelect";
import InputNumber from "./Element/InputNumber";
import InputCheckboxNumber from "./Element/InputCheckboxNumber";
import InputCheckbox from "./Element/InputCheckbox";
import InputCheckboxColor from "./Element/InputCheckboxColor";
import InputRange from "./Element/InputRange";

const EPUBReaderSettings = memo(
    ({
        makeScrollPos,
        readerRef,
        readerSettingExtender,
        setshortcutText,
        sizePlusRef,
        sizeMinusRef,
        fontSizePlusRef,
        fontSizeMinusRef,
    }: {
        makeScrollPos: () => void;
        readerRef: React.RefObject<HTMLDivElement>;
        readerSettingExtender: React.RefObject<HTMLButtonElement>;
        setshortcutText: React.Dispatch<React.SetStateAction<string>>;
        sizePlusRef: React.RefObject<HTMLButtonElement>;
        sizeMinusRef: React.RefObject<HTMLButtonElement>;
        fontSizePlusRef: React.RefObject<HTMLButtonElement>;
        fontSizeMinusRef: React.RefObject<HTMLButtonElement>;
    }) => {
        const appSettings = useAppSelector((store) => store.appSettings);
        const dispatch = useAppDispatch();

        const [isReaderSettingsOpen, setReaderSettingOpen] = useState(false);
        const [fontList, setFontList] = useState<string[]>([]);

        // useLayoutEffect(() => {
        // console.log("cccc");
        // }, [
        //     makeScrollPos,
        //     readerRef,
        //     readerSettingExtender,
        //     setshortcutText,
        //     sizePlusRef,
        //     sizeMinusRef,
        //     isReaderSettingsOpen,
        //     fontList,
        //     fontColor,
        //     linkColor,
        //     backgroundColor,
        //     progressBackgroundColor,
        //     appSettings,
        // ]);

        useLayoutEffect(() => {
            getFonts()
                .then((e) => {
                    setFontList(e);
                })
                .catch((e) => {
                    console.error("unable to get font list: ", e);
                });
        }, []);

        const maxWidth = 100;
        useEffect(() => {
            if (isReaderSettingsOpen) {
                const f = (e: KeyboardEvent) => {
                    if (e.key === "Escape") {
                        setReaderSettingOpen(false);
                        if (readerRef.current) readerRef.current.focus();
                    }
                };
                window.addEventListener("keydown", f);
                return () => {
                    window.removeEventListener("keydown", f);
                };
            }
        }, [isReaderSettingsOpen]);
        return (
            <div
                id="epubReaderSettings"
                className={"readerSettings " + (isReaderSettingsOpen ? "" : "closed")}
                onKeyDown={(e) => {
                    if (e.key === "Escape" || e.key === "q") {
                        e.stopPropagation();
                        setReaderSettingOpen(false);
                        if (readerRef.current) readerRef.current.focus();
                    }
                }}
            >
                <button
                    className="menuExtender"
                    ref={readerSettingExtender}
                    onClick={() => setReaderSettingOpen((init) => !init)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape" || e.key === "q") e.currentTarget.blur();
                    }}
                    {...(!isReaderSettingsOpen ? { "data-tooltip": "Reader Settings" } : {})}
                >
                    <FontAwesomeIcon icon={isReaderSettingsOpen ? faTimes : faBars} />
                </button>
                <div className="main">
                    <div className="settingItem">
                        <div
                            className={
                                "name " +
                                (!appSettings.epubReaderSettings.settingsCollapsed.size ? "expanded " : "")
                            }
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === " " || e.key === "Enter") e.currentTarget.click();
                            }}
                            onClick={() => {
                                dispatch(
                                    setEpubReaderSettings({
                                        settingsCollapsed: {
                                            ...appSettings.epubReaderSettings.settingsCollapsed,
                                            size: !appSettings.epubReaderSettings.settingsCollapsed.size,
                                        },
                                    })
                                );
                            }}
                        >
                            Size
                        </div>
                        <div className="options">
                            <InputNumber
                                value={appSettings.epubReaderSettings.readerWidth}
                                min={1}
                                max={maxWidth}
                                onChange={(e) => {
                                    makeScrollPos();
                                    let value = e.target.valueAsNumber;
                                    if (!value) value = 0;
                                    value = value >= maxWidth ? maxWidth : value;
                                    return value;
                                }}
                                timeout={[
                                    1000,
                                    (value) => dispatch(setEpubReaderSettings({ readerWidth: value })),
                                ]}
                                labeled={true}
                                labelAfter="%"
                            />
                            <button
                                ref={sizeMinusRef}
                                onClick={(e) => {
                                    makeScrollPos();
                                    // was 20 before
                                    const steps = appSettings.epubReaderSettings.readerWidth <= 40 ? 5 : 10;
                                    const readerWidth =
                                        appSettings.epubReaderSettings.readerWidth - steps > maxWidth
                                            ? maxWidth
                                            : appSettings.epubReaderSettings.readerWidth - steps < 1
                                            ? 1
                                            : appSettings.epubReaderSettings.readerWidth - steps;
                                    if (document.activeElement !== e.currentTarget)
                                        setshortcutText("-" + readerWidth + "%");
                                    dispatch(setEpubReaderSettings({ readerWidth }));
                                    // e.currentTarget.dispatchEvent(new MouseEvent(type:"")))
                                }}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <button
                                ref={sizePlusRef}
                                onClick={(e) => {
                                    makeScrollPos();
                                    const steps = appSettings.epubReaderSettings.readerWidth <= 40 ? 5 : 10;
                                    const readerWidth =
                                        appSettings.epubReaderSettings.readerWidth + steps > maxWidth
                                            ? maxWidth
                                            : appSettings.epubReaderSettings.readerWidth + steps < 1
                                            ? 1
                                            : appSettings.epubReaderSettings.readerWidth + steps;

                                    if (document.activeElement !== e.currentTarget)
                                        setshortcutText("+" + readerWidth + "%");
                                    dispatch(setEpubReaderSettings({ readerWidth }));
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>

                            <InputCheckbox
                                checked={appSettings.epubReaderSettings.limitImgHeight}
                                onChange={(e) => {
                                    makeScrollPos();
                                    dispatch(
                                        setEpubReaderSettings({
                                            limitImgHeight: e.currentTarget.checked,
                                        })
                                    );
                                }}
                                paraAfter="Limit Image height to viewport"
                            />
                        </div>
                    </div>
                    <div className="settingItem">
                        <div
                            className={
                                "name " +
                                (!appSettings.epubReaderSettings.settingsCollapsed.font ? "expanded " : "")
                            }
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === " " || e.key === "Enter") e.currentTarget.click();
                            }}
                            onClick={() => {
                                dispatch(
                                    setEpubReaderSettings({
                                        settingsCollapsed: {
                                            ...appSettings.epubReaderSettings.settingsCollapsed,
                                            font: !appSettings.epubReaderSettings.settingsCollapsed.font,
                                        },
                                    })
                                );
                            }}
                        >
                            Font & Layout
                        </div>
                        <div className="options">
                            <div className="row">
                                <InputNumber
                                    value={appSettings.epubReaderSettings.fontSize}
                                    min={1}
                                    max={100}
                                    onChange={(e) => {
                                        makeScrollPos();
                                        let value = e.target.valueAsNumber;
                                        if (!value) value = 0;
                                        value = value >= 100 ? 100 : value;
                                        return value;
                                    }}
                                    timeout={[
                                        1000,
                                        (value) => dispatch(setEpubReaderSettings({ fontSize: value })),
                                    ]}
                                    labeled={true}
                                    labelAfter="px"
                                />
                                <button
                                    ref={fontSizeMinusRef}
                                    onClick={(e) => {
                                        makeScrollPos();
                                        let newSize = appSettings.epubReaderSettings.fontSize - 1;

                                        newSize = newSize < 1 ? 1 : newSize;
                                        if (document.activeElement !== e.currentTarget)
                                            setshortcutText(newSize + "px");
                                        dispatch(setEpubReaderSettings({ fontSize: newSize }));
                                    }}
                                >
                                    <FontAwesomeIcon icon={faMinus} />
                                </button>
                                <button
                                    ref={fontSizePlusRef}
                                    onClick={(e) => {
                                        makeScrollPos();
                                        let newSize = appSettings.epubReaderSettings.fontSize + 1;

                                        newSize = newSize > 100 ? 100 : newSize;
                                        if (document.activeElement !== e.currentTarget)
                                            setshortcutText(newSize + "px");
                                        dispatch(setEpubReaderSettings({ fontSize: newSize }));
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                            <div className="col">
                                {/* <label>
                                <p>Font size&nbsp;:</p>
                                <input
                                    type="number"
                                    value={appSettings.epubReaderSettings.fontSize}
                                    min={1}
                                    max={100}
                                    onKeyDown={(e) => {
                                        if (e.key !== "Escape") {
                                            e.stopPropagation();
                                        }
                                    }}
                                    onChange={(e) => {
                                        makeScrollPos();
                                        let value = e.target.valueAsNumber;
                                        if (!value) value = 0;
                                        value = value >= 100 ? 100 : value;
                                        dispatch(setEpubReaderSettings({ fontSize: value }));
                                    }}
                                />
                                px
                            </label> */}
                                <InputCheckbox
                                    checked={!appSettings.epubReaderSettings.useDefault_fontFamily}
                                    onChange={(e) => {
                                        makeScrollPos();
                                        dispatch(
                                            setEpubReaderSettings({
                                                useDefault_fontFamily: !e.currentTarget.checked,
                                            })
                                        );
                                    }}
                                    paraAfter="Custom Font Family"
                                />
                                <InputSelect
                                    labeled={true}
                                    disabled={appSettings.epubReaderSettings.useDefault_fontFamily}
                                    value={appSettings.epubReaderSettings.fontFamily}
                                    onChange={(e) => {
                                        makeScrollPos();
                                        const val = e.currentTarget.value;
                                        dispatch(
                                            setEpubReaderSettings({
                                                fontFamily: val,
                                            })
                                        );
                                    }}
                                >
                                    {appSettings.epubReaderSettings.quickFontFamily.map((e) => (
                                        <option key={e} value={e} style={{ fontFamily: e }}>
                                            ★ {e}
                                        </option>
                                    ))}
                                    {/* <option value="Roboto"> ★ Roboto</option>
                                    <option value="Cambria"> ★ Cambria</option> */}
                                    {fontList.map((e) => (
                                        <option value={e} key={e} style={{ fontFamily: e }}>
                                            {e}
                                        </option>
                                    ))}
                                </InputSelect>
                                <button
                                    disabled={appSettings.epubReaderSettings.useDefault_fontFamily}
                                    onClick={() => {
                                        if (
                                            appSettings.epubReaderSettings.quickFontFamily.includes(
                                                appSettings.epubReaderSettings.fontFamily
                                            )
                                        ) {
                                            dispatch(
                                                setEpubReaderSettings({
                                                    quickFontFamily:
                                                        appSettings.epubReaderSettings.quickFontFamily.filter(
                                                            (e) => e !== appSettings.epubReaderSettings.fontFamily
                                                        ),
                                                })
                                            );
                                        } else {
                                            dispatch(
                                                setEpubReaderSettings({
                                                    quickFontFamily: [
                                                        ...appSettings.epubReaderSettings.quickFontFamily,
                                                        appSettings.epubReaderSettings.fontFamily,
                                                    ],
                                                })
                                            );
                                        }
                                    }}
                                >
                                    {appSettings.epubReaderSettings.quickFontFamily.includes(
                                        appSettings.epubReaderSettings.fontFamily
                                    )
                                        ? "Remove Star"
                                        : "Star Font Family"}
                                </button>
                                <InputCheckbox
                                    checked={!appSettings.epubReaderSettings.useDefault_fontWeight}
                                    onChange={(e) => {
                                        dispatch(
                                            setEpubReaderSettings({
                                                useDefault_fontWeight: !e.currentTarget.checked,
                                            })
                                        );
                                    }}
                                    paraAfter="Font Weight (if supported for font)"
                                />
                                <InputRange
                                    value={appSettings.epubReaderSettings.fontWeight}
                                    disabled={appSettings.epubReaderSettings.useDefault_fontWeight}
                                    min={100}
                                    max={900}
                                    step={100}
                                    labeled
                                    labelText=""
                                    timeout={[
                                        350,
                                        (value) =>
                                            dispatch(
                                                setEpubReaderSettings({
                                                    fontWeight: value,
                                                })
                                            ),
                                    ]}
                                />
                                <InputCheckboxNumber
                                    checked={!appSettings.epubReaderSettings.useDefault_lineSpacing}
                                    onChangeCheck={(e) => {
                                        makeScrollPos();
                                        dispatch(
                                            setEpubReaderSettings({
                                                useDefault_lineSpacing: !e.currentTarget.checked,
                                            })
                                        );
                                    }}
                                    step={0.1}
                                    min={0}
                                    max={20}
                                    value={appSettings.epubReaderSettings.lineSpacing}
                                    onChangeNum={(e) => {
                                        makeScrollPos();
                                        let value = e.currentTarget.valueAsNumber;
                                        if (value > 20) value = 20;
                                        if (value < 0) value = 0;
                                        return value;
                                    }}
                                    timeout={[
                                        1000,
                                        (value) => dispatch(setEpubReaderSettings({ lineSpacing: value })),
                                    ]}
                                    paraBefore="Line Height&nbsp;:"
                                    labelAfter="em"
                                />
                                <InputCheckboxNumber
                                    checked={!appSettings.epubReaderSettings.useDefault_paragraphSpacing}
                                    onChangeCheck={(e) => {
                                        makeScrollPos();
                                        dispatch(
                                            setEpubReaderSettings({
                                                useDefault_paragraphSpacing: !e.currentTarget.checked,
                                            })
                                        );
                                    }}
                                    step={0.1}
                                    min={0}
                                    max={20}
                                    value={appSettings.epubReaderSettings.paragraphSpacing}
                                    onChangeNum={(e) => {
                                        makeScrollPos();
                                        let value = e.currentTarget.valueAsNumber;
                                        if (value > 20) value = 20;
                                        if (value < 0) value = 0;
                                        return value;
                                    }}
                                    timeout={[
                                        1000,
                                        (value) => dispatch(setEpubReaderSettings({ paragraphSpacing: value })),
                                    ]}
                                    paraBefore="Paragraph Spacing&nbsp;:"
                                    labelAfter="em"
                                />
                                <InputCheckboxNumber
                                    checked={!appSettings.epubReaderSettings.useDefault_wordSpacing}
                                    onChangeCheck={(e) => {
                                        makeScrollPos();
                                        dispatch(
                                            setEpubReaderSettings({
                                                useDefault_wordSpacing: !e.currentTarget.checked,
                                            })
                                        );
                                    }}
                                    step={0.1}
                                    min={0}
                                    max={20}
                                    value={appSettings.epubReaderSettings.wordSpacing}
                                    onChangeNum={(e) => {
                                        makeScrollPos();
                                        let value = e.currentTarget.valueAsNumber;
                                        if (value > 20) value = 20;
                                        if (value < 0) value = 0;
                                        return value;
                                    }}
                                    timeout={[
                                        1000,
                                        (value) => dispatch(setEpubReaderSettings({ wordSpacing: value })),
                                    ]}
                                    paraBefore="Word Spacing&nbsp;:"
                                    labelAfter="em"
                                />

                                <InputCheckbox
                                    checked={appSettings.epubReaderSettings.noIndent}
                                    onChange={(e) => {
                                        dispatch(setEpubReaderSettings({ noIndent: e.currentTarget.checked }));
                                    }}
                                    paraAfter="No Indent"
                                />
                                {/* <InputCheckbox
                                    checked={appSettings.epubReaderSettings.hyphenation}
                                    onChange={(e) => {
                                        dispatch(setEpubReaderSettings({ hyphenation: e.currentTarget.checked }));
                                    }}
                                    paraAfter="Hyphenation"
                                /> */}
                            </div>
                        </div>
                    </div>
                    {/* <div className="settingItem">
                    <div className={"name " + "expanded"}>Reading mode</div>
                    <div className="options">
                        <button
                            className={appSettings.epubReaderSettings.readerTypeSelected === 0 ? "optionSelected" : ""}
                            onClick={() => dispatch(setEpubReaderSettings({ readerTypeSelected: 0 }))}
                        >
                            Vertical Scroll
                        </button>
                        <button
                            className={appSettings.epubReaderSettings.readerTypeSelected === 1 ? "optionSelected" : ""}
                            onClick={() => dispatch(setEpubReaderSettings({ readerTypeSelected: 1 }))}
                        >
                            Left to Right
                        </button>
                        <button
                            className={appSettings.epubReaderSettings.readerTypeSelected === 2 ? "optionSelected" : ""}
                            onClick={() => dispatch(setEpubReaderSettings({ readerTypeSelected: 2 }))}
                        >
                            Right to Left
                        </button>
                        <p>Coming Soon.</p>
                    </div>
                </div>
                <div className="settingItem">
                    <div className={"name " + "expanded"}>Pages per Row</div>
                    <div className="options">
                        <button
                            className={
                                appSettings.epubReaderSettings.pagesPerRowSelected === 0 ? "optionSelected" : ""
                            }
                            onClick={() => {
                                if (appSettings.epubReaderSettings.pagesPerRowSelected !== 0) {
                                    const pagesPerRowSelected = 0;

                                    let readerWidth = appSettings.epubReaderSettings.readerWidth / 2;
                                    if (readerWidth > maxWidth) readerWidth = maxWidth;
                                    if (readerWidth < 1) readerWidth = 1;
                                    dispatch(setEpubReaderSettings({ pagesPerRowSelected, readerWidth }));
                                }
                            }}
                        >
                            1
                        </button>
                        <button
                            className={
                                appSettings.epubReaderSettings.pagesPerRowSelected === 1 ? "optionSelected" : ""
                            }
                            onClick={() => {
                                const pagesPerRowSelected = 1;
                                let readerWidth = appSettings.epubReaderSettings.readerWidth;
                                if (appSettings.epubReaderSettings.pagesPerRowSelected === 0) {
                                    readerWidth *= 2;
                                    if (readerWidth > (appSettings.epubReaderSettings.widthClamped ? 100 : 500))
                                        readerWidth = appSettings.epubReaderSettings.widthClamped ? 100 : 500;
                                    if (readerWidth < 1) readerWidth = 1;
                                }
                                dispatch(setEpubReaderSettings({ pagesPerRowSelected, readerWidth }));
                            }}
                        >
                            2
                        </button>
                        <button
                            className={
                                appSettings.epubReaderSettings.pagesPerRowSelected === 2 ? "optionSelected" : ""
                            }
                            onClick={() => {
                                const pagesPerRowSelected = 2;
                                let readerWidth = appSettings.epubReaderSettings.readerWidth;
                                if (appSettings.epubReaderSettings.pagesPerRowSelected === 0) {
                                    readerWidth *= 2;
                                    if (readerWidth > (appSettings.epubReaderSettings.widthClamped ? 100 : 500))
                                        readerWidth = appSettings.epubReaderSettings.widthClamped ? 100 : 500;
                                    if (readerWidth < 1) readerWidth = 1;
                                }
                                dispatch(setEpubReaderSettings({ pagesPerRowSelected, readerWidth }));
                            }}
                        >
                            2 odd
                        </button>
                        <p>Coming Soon.</p>
                    </div>
                </div>
                <div className="settingItem">
                    <div className={"name " + "expanded"}>Reading side</div>
                    <div className="options">
                        <button
                            className={appSettings.epubReaderSettings.readingSide === 0 ? "optionSelected" : ""}
                            disabled={appSettings.epubReaderSettings.pagesPerRowSelected === 0}
                            onClick={() => {
                                dispatch(setEpubReaderSettings({ readingSide: 0 }));
                            }}
                        >
                            LTR
                        </button>
                        <button
                            className={appSettings.epubReaderSettings.readingSide === 1 ? "optionSelected" : ""}
                            disabled={appSettings.epubReaderSettings.pagesPerRowSelected === 0}
                            onClick={() => {
                                dispatch(setEpubReaderSettings({ readingSide: 1 }));
                            }}
                        >
                            RTL
                        </button>
                        <p>Coming Soon.</p>
                    </div>
                </div> */}

                    <div className="settingItem">
                        <div
                            className={
                                "name " +
                                (!appSettings.epubReaderSettings.settingsCollapsed.styles ? "expanded " : "")
                            }
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === " " || e.key === "Enter") e.currentTarget.click();
                            }}
                            onClick={() => {
                                dispatch(
                                    setEpubReaderSettings({
                                        settingsCollapsed: {
                                            ...appSettings.epubReaderSettings.settingsCollapsed,
                                            styles: !appSettings.epubReaderSettings.settingsCollapsed.styles,
                                        },
                                    })
                                );
                            }}
                        >
                            Styles & Others
                        </div>
                        <div className="options col">
                            <InputCheckboxColor
                                checked={!appSettings.epubReaderSettings.useDefault_fontColor}
                                onChangeCheck={(e) => {
                                    dispatch(
                                        setEpubReaderSettings({
                                            useDefault_fontColor: !e.currentTarget.checked,
                                        })
                                    );
                                }}
                                value={appSettings.epubReaderSettings.fontColor}
                                timeout={[
                                    500,
                                    (value) =>
                                        dispatch(
                                            setEpubReaderSettings({
                                                fontColor: value,
                                            })
                                        ),
                                ]}
                                paraBefore="Font Color&nbsp;:"
                            />
                            <InputCheckboxColor
                                checked={!appSettings.epubReaderSettings.useDefault_linkColor}
                                onChangeCheck={(e) => {
                                    dispatch(
                                        setEpubReaderSettings({
                                            useDefault_linkColor: !e.currentTarget.checked,
                                        })
                                    );
                                }}
                                value={appSettings.epubReaderSettings.linkColor}
                                timeout={[
                                    500,
                                    (value) =>
                                        dispatch(
                                            setEpubReaderSettings({
                                                linkColor: value,
                                            })
                                        ),
                                ]}
                                paraBefore="Link Color&nbsp;:"
                            />
                            <InputCheckboxColor
                                checked={!appSettings.epubReaderSettings.useDefault_backgroundColor}
                                onChangeCheck={(e) => {
                                    dispatch(
                                        setEpubReaderSettings({
                                            useDefault_backgroundColor: !e.currentTarget.checked,
                                        })
                                    );
                                }}
                                value={appSettings.epubReaderSettings.backgroundColor}
                                timeout={[
                                    500,
                                    (value) =>
                                        dispatch(
                                            setEpubReaderSettings({
                                                backgroundColor: value,
                                            })
                                        ),
                                ]}
                                paraBefore="Background Color&nbsp;:"
                            />
                            <InputCheckboxColor
                                checked={!appSettings.epubReaderSettings.useDefault_progressBackgroundColor}
                                onChangeCheck={(e) => {
                                    dispatch(
                                        setEpubReaderSettings({
                                            useDefault_progressBackgroundColor: !e.currentTarget.checked,
                                        })
                                    );
                                }}
                                value={appSettings.epubReaderSettings.progressBackgroundColor}
                                timeout={[
                                    500,
                                    (value) =>
                                        dispatch(
                                            setEpubReaderSettings({
                                                progressBackgroundColor: value,
                                            })
                                        ),
                                ]}
                                paraBefore="Progress Background Color&nbsp;:"
                            />
                            <InputCheckbox
                                checked={appSettings.epubReaderSettings.forceLowBrightness.enabled}
                                onChange={(e) => {
                                    dispatch(
                                        setEpubReaderSettings({
                                            forceLowBrightness: {
                                                ...appSettings.epubReaderSettings.forceLowBrightness,
                                                enabled: e.currentTarget.checked,
                                            },
                                        })
                                    );
                                }}
                                paraAfter="Force Low brightness"
                            />
                            <InputRange
                                className={"colorRange"}
                                min={0}
                                max={0.9}
                                step={0.05}
                                value={appSettings.epubReaderSettings.forceLowBrightness.value}
                                disabled={!appSettings.epubReaderSettings.forceLowBrightness.enabled}
                                labeled={true}
                                timeout={[
                                    350,
                                    (value) =>
                                        dispatch(
                                            setEpubReaderSettings({
                                                forceLowBrightness: {
                                                    ...appSettings.epubReaderSettings.forceLowBrightness,
                                                    value,
                                                },
                                            })
                                        ),
                                ]}
                            />
                            <InputCheckbox
                                checked={appSettings.epubReaderSettings.invertImageColor}
                                onChange={(e) => {
                                    dispatch(setEpubReaderSettings({ invertImageColor: e.currentTarget.checked }));
                                }}
                                title="To blend decoration images better"
                                paraAfter="Invert and Blend Image Color"
                            />
                            <InputCheckbox
                                checked={appSettings.epubReaderSettings.showProgressInZenMode}
                                onChange={(e) => {
                                    dispatch(
                                        setEpubReaderSettings({ showProgressInZenMode: e.currentTarget.checked })
                                    );
                                }}
                                paraAfter="Show progress in Zen mode"
                            />
                        </div>
                    </div>
                    <div className="settingItem">
                        <div
                            className={
                                "name " +
                                (!appSettings.epubReaderSettings.settingsCollapsed.scrollSpeed ? "expanded " : "")
                            }
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === " " || e.key === "Enter") e.currentTarget.click();
                            }}
                            onClick={() => {
                                dispatch(
                                    setEpubReaderSettings({
                                        settingsCollapsed: {
                                            ...appSettings.epubReaderSettings.settingsCollapsed,
                                            scrollSpeed:
                                                !appSettings.epubReaderSettings.settingsCollapsed.scrollSpeed,
                                        },
                                    })
                                );
                            }}
                        >
                            Scroll Speed (with keys)
                        </div>
                        <div className="options">
                            <InputNumber
                                value={appSettings.epubReaderSettings.scrollSpeedA}
                                min={1}
                                max={500}
                                onChange={(e) => {
                                    let value = e.currentTarget.valueAsNumber;
                                    if (value > 500) value = 500;
                                    if (value < 1) value = 1;
                                    return value;
                                }}
                                timeout={[
                                    1000,
                                    (value) => dispatch(setEpubReaderSettings({ scrollSpeedA: value })),
                                ]}
                                labeled={true}
                                labelBefore=" Scroll&nbsp;A&nbsp;:"
                                labelAfter="px"
                            />
                            <InputNumber
                                value={appSettings.epubReaderSettings.scrollSpeedB}
                                min={1}
                                max={500}
                                onChange={(e) => {
                                    let value = e.currentTarget.valueAsNumber;
                                    if (value > 500) value = 500;
                                    if (value < 1) value = 1;
                                    return value;
                                }}
                                timeout={[
                                    1000,
                                    (value) => dispatch(setEpubReaderSettings({ scrollSpeedB: value })),
                                ]}
                                labeled={true}
                                labelBefore=" Scroll&nbsp;B&nbsp;:"
                                labelAfter="px"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

export default EPUBReaderSettings;
