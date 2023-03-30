import { Router, Request } from "express";

import {
    createUserCtr,
    deleteUserCtr,
    getManyUser,
    getOneUser,
    updateUserCtr
} from "../controller";
import {
    getResponse,
    HTTPStatusCodes,
    HTTP_METHODS,
    param,
    throwError,
    userFilter,
    userInput
} from "../utils";
import { IsAuthenticated, IsOwner } from "../middleware";
import { findOneUser } from "../services";

const userRouter = Router();

const CreateAndRead = [HTTP_METHODS.GET, HTTP_METHODS.POST]

async function getUserInstance(req: Request){
    
    return {
        user: await findOneUser(req.session.user?.id),
        select: "user"
    }

}

userRouter.use(
    IsAuthenticated(CreateAndRead),
    IsOwner("id", getUserInstance, CreateAndRead)
);

userRouter.post("/", async (req, res,) => {

    const userData = userInput.parse(req.body);

    res.status(HTTPStatusCodes.CREATED)
        .send(
            getResponse(
                "user created succesfully",
                await createUserCtr(userData)
            )
        );
});

userRouter.put("/",async (req, res) => {

    const userData = userInput.parse(req.body);

    res.status(HTTPStatusCodes.OK)
        .send(
            getResponse(
                "user updated successfully",
                await updateUserCtr(req.context?.user!, userData, req.session)
            )
        );
});

userRouter.get("/", async (req, res) => {
    const filterParams = userFilter.parse(req.query);

    res.status(HTTPStatusCodes.OK)
        .send(
            getResponse(
                "users found",
                await getManyUser(filterParams)
            )
        );
});

userRouter.get("/:id", async (req, res) => {

    const params = param.parse(req.params);

    res.status(HTTPStatusCodes.OK)
        .send(
            getResponse(
                "userfound",
                await getOneUser(params.id)
            )
        );
});

userRouter.delete("/",async (req, res,) => {

    await deleteUserCtr(req.context?.user!, req.sessionID);

    req.session.destroy( err => {

        throwError(err);
    });

    res.status(HTTPStatusCodes.OK)
        .send(getResponse("user deleted successfully"));
});