<?php

namespace JanDolata\CrudeCRUD\Engine\Interfaces;

use JanDolata\CrudeCRUD\Engine\Models\FileLog;

interface OrderInterface
{
    public function resetOrder();
    public function reorder(array $newOrder);
    public function storeInFirstPlace();
}
