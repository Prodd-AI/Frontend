import logo from "../../../public/assets/icons/logo.svg"
function Logo() {
  return (
    <div className="flex items-center border">
        <img src={logo} alt="Prod AI logo" />
        <h2 className=" font-semibold text-xl">Prod AI</h2>
    </div>
  )
}

export default Logo