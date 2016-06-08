<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

interface RestInterface extends
    \JanDolata\CrudeCRUD\Engine\Interfaces\ListInterface,
    \JanDolata\CrudeCRUD\Engine\Interfaces\StoreInterface,
    \JanDolata\CrudeCRUD\Engine\Interfaces\UpdateInterface,
    \JanDolata\CrudeCRUD\Engine\Interfaces\DeleteInterface
{ }
