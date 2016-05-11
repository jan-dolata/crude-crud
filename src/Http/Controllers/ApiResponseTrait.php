<?php

namespace JanDolata\CrudeCRUD\Http\Controllers;

trait ApiResponseTrait
{
    /**
     * Return a 404 not found response with a message.
     */
    protected function notFoundResponse($message = 'Not found')
    {
        return response()->json([
            'error' => [
                'message' => $message
            ]
        ], 404);
    }

    /**
     * Return a 200 response with data.
     */
    protected function successResponse($data = [])
    {
        return response()->json([
            'data' => $data
       ], 200);
    }

    /**
     * Return a 403 forbidden response with a message.
     */
    protected function forbiddenResponse($message = 'Access forbidden')
    {
        return response()->json([
            'error' => [
                'message' => $message
            ]
        ], 403);
    }
}
