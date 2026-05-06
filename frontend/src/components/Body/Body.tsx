import "./Body.css"
import { TestPage } from "../../pages/testPage";

export function Body() {

  return (
    <div className='body'>
      <div className='body_container'>
        <TestPage />
      </div>
    </div>
  );
}