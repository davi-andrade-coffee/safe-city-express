import ServerHttp from "../server/http";
import newContainer from "./container";

(async () => {
    const container = await newContainer();
    
    const serverHttp = container.get(ServerHttp);
    serverHttp.start();

})()