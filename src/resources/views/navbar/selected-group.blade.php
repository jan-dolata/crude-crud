<?php
    $group['routeName'] = is_array($group['routeName']) ? $group['routeName'] : [$group['routeName']];
?>
@if(in_array($currentRouteName, $group['routeName']) && count($group['routeName']) > 1)
    <ul class="list-inline">
        @foreach ($group['routeName'] as $route)
            <li class="small {{ $currentRouteName == $route ? 'active' : '' }}">
                <a href="{{ route($route) }}" class="p">
                    {{ trans($routeTrans . '.' . $route) }}
                </a>
            </li>
        @endforeach
    </ul>
@endif
