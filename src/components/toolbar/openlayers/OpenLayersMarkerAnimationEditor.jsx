import { useState } from "react";

import useEditOlMarkerAnimation from "../../../hooks/path/useEditOlMarkerAnimation.js";

const OpenLayersMarkerAnimationEditor = () => {

    const [ activeLabel, setActiveLabel ] = useState( null );
    const handleButtonClick = ( label ) => {
        setActiveLabel( label ); // 핸들러가 hook 과 직접적으로 연결될 수 없으니 상태를 통해 간접적으로 연결
    };

    const buttons = [
        { label: 'Start Animation' },
        { label: 'Stop Animation' },
    ];

    useEditOlMarkerAnimation( { label: activeLabel } )

    return (
        <div style={ { padding: '10px', background: '#f4f4f4', borderBottom: '1px solid #ddd' } }>
            { buttons.map( ( { label } ) => (
                <button
                    key={ label }
                    onClick={ () => handleButtonClick( label ) }
                >
                    { label }
                </button>

            ) ) }
            <p>{ `activeLabel: ${ activeLabel }` }</p>
        </div>
    );
};

export default OpenLayersMarkerAnimationEditor;
