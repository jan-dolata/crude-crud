<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use JanDolata\CrudeCRUD\Http\Requests\ExportRequest;
use Storage;

class ExportController extends BaseController
{
    protected $csvHeaders = [
        'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
        'Content-type'        => 'text/csv; charset=UTF-8',
        'Expires'             => '0',
        'Pragma'              => 'public',
        'Content-Encoding'    => 'UTF-8'
    ];

    public function csv(ExportRequest $request, $crudeName)
    {
        $list = $request->crude
            ->getFiltered(null, null, null, null, null, null);

        $setup = $request->crude->getCrudeSetup();
        $column = $setup->getCsvColumn();
        if (empty($column))
            $column = $setup->getColumnAttr();
        
        $list = $this->formatData($list, $column);

        $fileName = $this->fileName($setup, 'csv');

        $headers = $this->csvHeaders;
        $headers['Content-Disposition'] = 'attachment; filename=' . $fileName;

        $callback = function() use ($list, $column)
        {
            $file = fopen('php://output', 'w');
            fputcsv($file, $column, "\t");
            foreach ($list as $row) {
                fputcsv($file, $row, "\t");
            }
            fclose($file);
        };

        return \Response::stream($callback, 200, $headers);
    }

    public function formatData($list, $column)
    {
        $data = [];
        foreach ($list as $model) {
            $item = [];
            foreach ($column as $c) {
                $item[$c] = is_array($model[$c])
                    ? count($model[$c])
                    : $model[$c];
            }
            $data[] = $item;
        }
        return $data;
    }

    private function columnNames($setup, $column)
    {
        $columnNames = [];
        $attrName = $setup->getTrans();
        foreach ($column as $c) {
            $columnNames[] = isset($attrName[$c])
                ? $attrName[$c]
                : trans('validation.attributes.' . $c);
        }
        return $columnNames;
    }

    private function fileName($setup, $extension)
    {
        return $setup->getTitle() . '_' . date("Y_m_d_H_i") . '.' . $extension;
    }

}
