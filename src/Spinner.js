export default function Spinner(props){
    return (
        <div style={{
            height:props.radius,
            width:props.radius,
            border:`${props.borderHeight} solid ${props.borderColor}`,
            borderTopColor:props.loaderColor,
            borderRadius:'50%'
        }} className='animate-spin'></div>
    );
}
