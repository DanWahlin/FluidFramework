/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    IDocumentStorage,
    IProducer,
    ITenantManager,
    MongoManager,
} from "@fluidframework/server-services-core";
import cors from "cors";
import { Router } from "express";
import { Provider } from "nconf";
import { IAlfredTenant } from "@fluidframework/server-services-client";
import * as api from "./api";
import * as deltas from "./deltas";
import * as documents from "./documents";

export function create(
    config: Provider,
    tenantManager: ITenantManager,
    storage: IDocumentStorage,
    mongoManager: MongoManager,
    producer: IProducer,
    appTenants: IAlfredTenant[]): Router {
    const router: Router = Router();
    const deltasRoute = deltas.create(config, tenantManager, mongoManager, appTenants);
    const documentsRoute = documents.create(storage, appTenants);
    const apiRoute = api.create(config, producer, tenantManager, storage);

    router.use(cors());
    router.use("/deltas", deltasRoute);
    router.use("/documents", documentsRoute);
    router.use("/api/v1", apiRoute);

    return router;
}
