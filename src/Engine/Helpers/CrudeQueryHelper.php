<?php

namespace JanDolata\CrudeCRUD\Engine\Helpers;

use DB;

class CrudeQueryHelper
{

    public static function join(&$query, $table, $tableKey, $tableToJoin, $tableToJoinKey)
    {
        return $query
            ->leftJoin($tableToJoin, function ($join) use ($table, $tableToJoin, $tableKey, $tableToJoinKey) {
                $join
                    ->on($tableToJoin . '.' . $tableToJoinKey, '=', $table . '.' . $tableKey)
                    ->whereNull($tableToJoin . '.deleted_at');
            })
            ->groupBy($table . '.id');
    }

    public static function joinAndCount(&$query, $table, $tableKey, $tableToJoin, $tableToJoinKey, $countName = null)
    {
        if ($countName == null)
            $countName = 'num_' . $tableToJoin;

        return self::join($query, $table, $tableKey, $tableToJoin, $tableToJoinKey)
            ->addSelect(
                DB::raw('COUNT(' . $tableToJoin . '.id) as ' . $countName)
            );
    }

}
