export const Todo = (props) => {
  
    return (
    
    <li class = "flex gap-1">
    <label>
        <input type="checkbox"  onChange={() => props.toggle(props.id)}/> {props.name}
    </label>
    <button class="text-gray-400" onClick={(() => props.delete(props.id))}>{props.element}</button>
</li>

    )
}