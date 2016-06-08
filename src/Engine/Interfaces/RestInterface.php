<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

use JanDolata\CrudeCRUD\Engine\Interfaces\ListInterface;
use JanDolata\CrudeCRUD\Engine\Interfaces\StoreInterface;
use JanDolata\CrudeCRUD\Engine\Interfaces\UpdateInterface;

interface RestInterface extends
    \JanDolata\CrudeCRUD\Engine\Interfaces\ListInterface,
    \JanDolata\CrudeCRUD\Engine\Interfaces\StoreInterface,
    \JanDolata\CrudeCRUD\Engine\Interfaces\UpdateInterface,
    \JanDolata\CrudeCRUD\Engine\Interfaces\DeleteInterface
{ }
