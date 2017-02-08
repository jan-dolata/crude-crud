<?php

namespace JanDolata\CrudeCRUD\Engine\Traits\FromModelTraitPart;

trait OrderTrait
{

    /**
     * Store in last place
     *
     * @var boolean
     */
    protected $storeInLastPlace = true;

    /**
     * New item will store in first place in order
     */
    public function storeInFirstPlace()
    {
        $this->storeInLastPlace = false;
        return $this;
    }

    /**
     * Reset order
     */
    public function resetOrder()
    {
        $param = $this->crudeSetup->getOrderParameters();
        $idAttr = $param['idAttr'];
        $orderAttr = $param['orderAttr'];

        $all = $this->model
            ->orderBy($orderAttr)
            ->select($idAttr, $orderAttr)
            ->get();

        $all = $all->map(function ($model, $i) use ($idAttr) {
            return [
                'id' => $model->$idAttr,
                'order' => $i + 1
            ];
        })->toArray();

        $this->reorder($all);
    }

    /**
     * Set new order for selected items
     *
     * @param  array $newOrder - list of ids and new order positions
     */
    public function reorder(array $newOrder)
    {
        $param = $this->crudeSetup->getOrderParameters();
        $idAttr = $param['idAttr'];
        $orderAttr = $param['orderAttr'];
        $table = $this->model->getTable();

        $data = collect($newOrder)->map(function($item) {
            return "({$item['id']},{$item['order']})";
        })->toArray();

        $data = implode(',', $data);

        \DB::statement("INSERT INTO {$table} (`{$idAttr}`,`{$orderAttr}`) VALUES {$data} ON DUPLICATE KEY UPDATE `{$orderAttr}`=VALUES(`{$orderAttr}`);");
    }
}
