/*
 * Copyright (c) 2018. AIT
 */

export interface ListServiceInterface {

    getCount(formData);

    getList(formData);

    getItem(id, formData);

    addItem(formData);

    editItem(id, formData);

    deleteItem(id, formData);

}
