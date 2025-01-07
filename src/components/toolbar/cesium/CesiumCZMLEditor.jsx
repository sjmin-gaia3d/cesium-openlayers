import { useState } from "react";
import useEditCzml from "../../../hooks/path/useEditCzml.js";

const CesiumCZMLEditor = () => {
    const [ activeLabel, setActiveLabel ] = useState( null );
    const handleButtonClick = ( label ) => {
        setActiveLabel( label ); // 핸들러가 hook 과 직접적으로 연결될 수 없으니 상태를 통해 간접적으로 연결
    };

    // 기능별 분기 처리를 위한 버튼 label 선언
    const buttons = [
        { label: 'Draw CZML' },
        { label: 'Save CZML' },
    ];

    useEditCzml( { label: activeLabel } ); // hook 내부 메서드와 label 매핑

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

export default CesiumCZMLEditor;