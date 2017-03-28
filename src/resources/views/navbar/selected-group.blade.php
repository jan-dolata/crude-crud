<?php

    function findGroup($groups, $currentRouteName) {
        foreach ($groups as $group) {
            $group['routeName'] = is_array($group['routeName'])
                ? $group['routeName']
                : [$group['routeName']];

            if (in_array($currentRouteName, $group['routeName']) && count($group['routeName']) > 1)
                return $group;
        }

        return null;
    }

    $selectedGroup = findGroup($left, $currentRouteName);
    $alignClass = 'text-left';

    if (empty($selectedGroup)) {
        $selectedGroup = findGroup($right, $currentRouteName);
        $alignClass = 'text-right';
    }
?>

@if(! empty($selectedGroup))
    <div class="container hidden-xs m-t">
        <div class="{{ $alignClass }}">
            <ul class="list-inline">
                @foreach ($selectedGroup['routeName'] as $route)
                    <li class="small {{ $currentRouteName == $route ? 'active' : '' }}">
                        <a href="{{ route($route) }}" class="p">
                            {{ trans($routeTrans . '.' . $route) }}
                        </a>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
@endif
